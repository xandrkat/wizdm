import { AngularFirestore } from '@angular/fire/firestore';
import { DatabaseDocument } from './database-document'
import { DatabaseCollection } from './database-collection';
import { PagedCollection } from './database-paged';
import { DistributedCounter } from './database-counter';
import { firestore } from 'firebase/app';
//--
export type CollectionRef = firestore.CollectionReference;
export type DocumentRef = firestore.DocumentReference;
export type WriteBatch = firestore.WriteBatch;
export type Transaction = firestore.Transaction;
export type Timestamp = firestore.Timestamp;
export type FieldPath = firestore.FieldPath;
export type FieldValue = firestore.FieldValue;
export type GeoPoint = firestore.GeoPoint;
export type Query = firestore.Query;
export type QueryFn = (ref: CollectionRef | Query) => Query;

export abstract class DatabaseApplication {

  constructor(readonly afs: AngularFirestore) { }

  /** Returns the firestore instance */
  public get firestore() { return this.afs.firestore; }

  /** Returns an ID sentinel to be used in queries */
  public get sentinelId(): FieldPath {
    return firestore.FieldPath.documentId();
  }

  /** Returns a server timestamp palceholder (it'll turn into a timestamp serverside) */
  public get timestamp(): FieldValue {
    return firestore.FieldValue.serverTimestamp();
  }

  /** Returns a sentinel for use with update to mark the field for deletion */
  public get delete(): FieldValue {
    return firestore.FieldValue.delete();
  }

  /** Returns a special value that can be used with set() or update() telling the server to increment the field's current value */
  public increment(n: number): FieldValue {
    return firestore.FieldValue.increment(n);
  }

  /** Returns a special value that can be used with set() or update() telling the server to add the given elements to an array */
  public arrayUnion<T>(...elements: T[]): FieldValue {
    return firestore.FieldValue.arrayUnion(elements);
  }

  /** Returns a special value that can be used with set() or update() telling the server to remove the given elements from an array */
  public arrayRemove<T>(...elements: T[]): FieldValue {
    return firestore.FieldValue.arrayRemove(elements);
  }

  /** Creates a geopoint at the given lat and lng */
  public geopoint(lat: number, lng: number): GeoPoint {
    return new firestore.GeoPoint(lat, lng);
  }

  /** Returns a firestore.WriteBatch re-typed into a WriteBatch to support batch operations */
  public batch(): WriteBatch {
    return this.firestore.batch();
  }

  /** Runs a firestore.Transaction to support atomic operations */
  public transaction<T>( updateFn: (t: Transaction) => Promise<T> ): Promise<T> {
    return this.firestore.runTransaction<T>(updateFn);
  }

  public doc(ref: string|DocumentRef): DocumentRef {
    return !!ref ? (typeof ref === 'string' ? this.firestore.doc(ref) : ref) : null;
  }

  public col(ref: string|CollectionRef): CollectionRef {
    return !!ref ? (typeof ref === 'string' ? this.firestore.collection(ref) : ref) : null;
  }

  /** Database Objects Factories */
  public abstract document<T>(path: string|DocumentRef): DatabaseDocument<T>;
  public abstract collection<T>(path: string|CollectionRef): DatabaseCollection<T>;
  public abstract pagedCollection<T>(path: string|CollectionRef): PagedCollection<T>;
  public abstract counter(path: string|CollectionRef, shards: number): DistributedCounter;
}