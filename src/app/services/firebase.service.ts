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
  public categoriesCollection: AngularFirestoreCollection;
  public productsCollection: AngularFirestoreCollection;


  constructor(
    private afs: AngularFirestore
  ) { }

  public getCategories(language: string, species: string): Observable<any[]> {
    this.categoriesCollection =
      this.afs.collection(
        `sw-products-categorized/${language}/${species}`, ref => ref.orderBy('categoryName', 'asc')
      );
    return this.categoriesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => a.payload.doc.data()))
    );
  }

  public getProductsToCategory(language: string, species: string, productKey: string): Observable<any[]> {
    this.productsCollection = this.afs.collection(
      `sw-products-categorized/${language}/${species}/${productKey}/data`
    );
    return this.productsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => a.payload.doc.data()))
    );
  }

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
