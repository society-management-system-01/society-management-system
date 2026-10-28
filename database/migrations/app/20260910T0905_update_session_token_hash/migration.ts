#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/6116fef166f64050384f52ff8335d97f07473ecbe8dad4d48d1ab40da203bd80/contract';
import startContract from '../../snapshots/6116fef166f64050384f52ff8335d97f07473ecbe8dad4d48d1ab40da203bd80/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/87fb14432d7dbf967d4436f5ade98dc062c9d4830f8a6eea1aa52d9d97877ccd/contract';
import endContract from '../../snapshots/87fb14432d7dbf967d4436f5ade98dc062c9d4830f8a6eea1aa52d9d97877ccd/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
