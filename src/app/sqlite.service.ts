// import { Injectable } from '@angular/core';
// import initSqlJs, { SqlJsStatic } from 'sql.js';
// import { Database } from 'sql.js';
//
//
// @Injectable({
//   providedIn: 'root',
// })
// export class SqliteService {
//   private db: Database | null = null;
//   private readonly localStorageKey = 'sqlite_db';
//
//   constructor() {
//     this.initDatabase();
//   }
//
//   async initDatabase() {
//     const SQL = await initSqlJs({/* options */});
//     this.loadDatabaseFromLocalStorage(SQL);
//   }
//
//   loadDatabaseFromLocalStorage(SQL: typeof import('sql.js')) {
//     const dbData = localStorage.getItem(this.localStorageKey);
//     if (dbData) {
//       const binaryArray = new Uint8Array(dbData.split('').map(char => char.charCodeAt(0)));
//       this.db = new Database(binaryArray);
//     } else {
//       // Initialize a new SQLite database if none is found in local storage
//       this.db = new SQL.Database();
//     }
//   }
//
//   saveDatabaseToLocalStorage() {
//     // Your code to save the SQLite database to local storage
//   }
// }
