import { Injectable } from '@angular/core';
import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private sql!: SqlJsStatic;
  private db!: Database;

  constructor() {
    this.initDatabase();
  }

  private async initDatabase(): Promise<void> {
    this.sql = await initSqlJs();
    this.db = new this.sql.Database();
  }

  // Add your SQLite query methods here
}
