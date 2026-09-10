#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/4ef4a8201466cc14c17910669de0d6497f06241d7bea4c1ffdd647e4c1e659d8/contract';
import startContract from '../../snapshots/4ef4a8201466cc14c17910669de0d6497f06241d7bea4c1ffdd647e4c1e659d8/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/6116fef166f64050384f52ff8335d97f07473ecbe8dad4d48d1ab40da203bd80/contract';
import endContract from '../../snapshots/6116fef166f64050384f52ff8335d97f07473ecbe8dad4d48d1ab40da203bd80/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
