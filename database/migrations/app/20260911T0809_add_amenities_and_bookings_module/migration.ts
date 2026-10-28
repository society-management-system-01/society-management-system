#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/19e2791bf5aa43dcc2feb3a16825b56048cbd51c115e592a9d4744b72d728353/contract';
import endContract from '../../snapshots/19e2791bf5aa43dcc2feb3a16825b56048cbd51c115e592a9d4744b72d728353/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/87fb14432d7dbf967d4436f5ade98dc062c9d4830f8a6eea1aa52d9d97877ccd/contract';
import startContract from '../../snapshots/87fb14432d7dbf967d4436f5ade98dc062c9d4830f8a6eea1aa52d9d97877ccd/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
