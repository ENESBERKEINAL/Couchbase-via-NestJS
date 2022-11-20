import { Injectable, OnModuleInit } from '@nestjs/common';
import { CouchBaseAdapterService } from './couch-base-adapter/couch-base-adapter.service';
import {
  Bucket,
  Cluster,
  Collection,
  QueryOptions,
  QueryResult,
} from 'couchbase';
import { UserDTO } from './dto/userDto';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private couchBaseService: CouchBaseAdapterService) {}

  private collection: Collection;
  private cluster: Cluster;
  private bucket: Bucket;

  async onModuleInit(): Promise<void> {
    this.cluster = await this.couchBaseService.connectDb();
    this.bucket = this.cluster.bucket('main-bucket');
    this.collection = this.bucket.collection('_default');
  }

  async updateUser(documentId: number, wholeDocument: any) {
    try {
      const documentKeyValue = 'computer:' + documentId;

      const query = `UPDATE \`main-bucket\` USE KEYS $ID 
      SET name = $NAME RETURNING id,name;`;
      const options: QueryOptions = {
        parameters: { ID: documentKeyValue, NAME: wholeDocument.name },
      };

      if ((await this.getSingleDocumentWithId(documentId)).length) {
        console.log('User updated successfully', documentKeyValue);
        const queryResult: QueryResult = await this.cluster.query(
          query,
          options,
        );

        return queryResult.rows;
      } else {
        console.log('Error user update operations document not exist ', documentKeyValue);
        return {'document not exist': 'null'}
      }
    } catch (error) {
      console.log('Error while updating user Error-> ', error);
      return {'Error while updating user Error-> ': 'error'}
    }
  }

  async deleteUser(documentId: number) {
    if ((await this.getSingleDocumentWithId(documentId)).length) {
      const documentKeyValue = 'computer:' + documentId;

      const query = `DELETE FROM \`main-bucket\` k USE KEYS $ID RETURNING k`;
      const options: QueryOptions = { parameters: { ID: documentKeyValue } };

      const users: QueryResult = await this.cluster.query(query, options);

      console.log(`Document 'computer:#${documentId}' deleted successfully`);
      return `Document 'computer:#${documentId}' deleted successfully`;
    }

    console.log(`Document already deleted`);
    return 'Document already deleted';
  }

  async getSingleDocumentWithId(documentId: number) {
    const documentKeyValue = 'computer:' + documentId;

    const query = `SELECT * FROM \`main-bucket\` USE KEYS $ID`;
    const options: QueryOptions = { parameters: { ID: documentKeyValue } };

    const users: QueryResult = await this.cluster.query(query, options);

    console.log('select ids -> ', users.rows);

    return users.rows;
  }

  postUsers(documentName: string): UserDTO {
    const user = {
      type: 'computer',
      id: Math.floor(Math.random() * 1000),
      name: documentName,
    };

    const upsertSingleDocument = async () => {
      try {
        const key = `${user.type}:${user.id}`;
        delete user.type;
        const result = await this.collection.upsert(key, user);
        console.log('Result', result);
        console.log(`Upserting one single doc w/ key: ${key}\n`);
      } catch (error) {
        console.error('Error while upserting', error);
      }
    };

    upsertSingleDocument();

    return user;
  }

  async getUsers(): Promise<any> {
    const query = 'SELECT id,name FROM `main-bucket`';

    const users: QueryResult = await this.cluster.query(query);

    return users.rows;
  }

  getHello(): string {
    return 'Add "/api" to end of url';
  }
}
