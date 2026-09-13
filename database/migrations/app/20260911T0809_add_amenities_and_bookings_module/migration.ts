#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/4ef4a8201466cc14c17910669de0d6497f06241d7bea4c1ffdd647e4c1e659d8/contract';
import endContract from '../../snapshots/4ef4a8201466cc14c17910669de0d6497f06241d7bea4c1ffdd647e4c1e659d8/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/f39f4022ce13f9613c77b3758754ffa7a620e89a193ebad0a58334f107db3656/contract';
import startContract from '../../snapshots/f39f4022ce13f9613c77b3758754ffa7a620e89a193ebad0a58334f107db3656/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      {
        id: 'op_enable_btree_gist',
        label: 'Enable btree_gist extension for range exclusion',
        operationClass: 'additive',
        type: 'sql',
        sql: 'CREATE EXTENSION IF NOT EXISTS btree_gist;',
      },
      {
        id: 'op_add_booking_exclusion_constraint',
        label: 'Add GiST exclusion constraint for overlapping bookings',
        operationClass: 'additive',
        type: 'sql',
        sql: `
          ALTER TABLE "booking" 
          ADD CONSTRAINT "no_overlapping_bookings" 
          EXCLUDE USING gist (
            "amenityId" WITH =,
            tstzrange("startTime", "endTime", '[)') WITH &&
          ) WHERE (status IN ('PENDING', 'APPROVED'));
        `,
      },
    ] as any;
  }
}

MigrationCLI.run(import.meta.url, M);