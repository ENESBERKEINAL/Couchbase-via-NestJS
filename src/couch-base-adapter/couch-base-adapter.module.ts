import { Module } from '@nestjs/common';
import { CouchBaseAdapterService } from './couch-base-adapter.service';

@Module({
  providers: [CouchBaseAdapterService],
  exports:[CouchBaseAdapterService]
})
export class CouchBaseAdapterModule {


}
