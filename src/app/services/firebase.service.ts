import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public scanDBCollection: AngularFirestoreCollection;
  public therapyCollection: AngularFirestoreCollection;
  public medicationCollection: AngularFirestoreCollection;
  public findingsCollection: AngularFirestoreCollection;
  public diagnosisCollection: AngularFirestoreCollection;


  constructor(
    private afs: AngularFirestore
  ) { }

  public getScanDB(language: string, collection: string, species?: string): Observable<any[]> {
    if (collection === 'medication') {
      this.medicationCollection = this.afs.collection(
        `scan-db/${collection}/${language}/data/${species}`, ref => ref.orderBy('name', 'asc')
      );
      return this.medicationCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          return a.payload.doc.data();
        }))
      );
    }
    if (collection === 'diagnosis') {
      this.diagnosisCollection = this.afs.collection(
        `scan-db/${collection}/${language}/data/${species}`, ref => ref.orderBy('name', 'asc')
      );
      return this.diagnosisCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          return a.payload.doc.data();
        }))
      );
    }
    if (collection === 'therapy') {
      this.therapyCollection = this.afs.collection(
        `scan-db/${collection}/${language}`, ref => ref.orderBy('name', 'asc')
      );
      return this.therapyCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          return a.payload.doc.data();
        }))
      );
    }
    if (collection === 'findings') {
      this.findingsCollection = this.afs.collection(
        `scan-db/${collection}/${language}`, ref => ref.orderBy('name', 'asc')
      );
      return this.findingsCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          return a.payload.doc.data();
        }))
      );
    }

  }
}
