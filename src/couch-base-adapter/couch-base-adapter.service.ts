import { Injectable } from '@nestjs/common';
import { Cluster } from 'couchbase';
import * as couchbase from 'couchbase';

@Injectable()
export class CouchBaseAdapterService {

  async connectDb(): Promise<Cluster> {
    const clusterConnStr = 'couchbase://localhost';
    const username = 'Administrator';
    const password = 'asdasd123';

    try {
      const cluster = await couchbase.connect(clusterConnStr, {
        username: username,
        password: password,
      });

      return cluster;
    } catch (e) {
      return e;
    }
  }
}
