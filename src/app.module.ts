import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CouchBaseAdapterModule } from './couch-base-adapter/couch-base-adapter.module';

@Module({
  imports: [CouchBaseAdapterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
