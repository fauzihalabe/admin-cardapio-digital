import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";


@Component({
  selector: "app-pedidos",
  templateUrl: "./pedidos.component.html",
})
export class PedidosComponent implements OnInit {

  pedidos = [];
  config = {
    nome: null,
    whatsapp: null,
    color: null,
    logo: null,
    banner: null,
  };
  downloadURL: Observable<string>;
  selectedFile: File = null;
  fb;
  downloadURL2: Observable<string>;
  selectedFile2: File = null;
  fb2;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {

  }

  //Upload do logo
  onFileSelected(event) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `imagems/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`imagems/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            //Salva a URL gerada para o arquivo
            if (url) {
              this.fb = url;
              this.config.logo = this.fb;
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  //Upload do banner
  onFileSelected2(event) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `imagems/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`imagems/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL2 = fileRef.getDownloadURL();
          this.downloadURL2.subscribe(url => {
            //Salva a URL gerada para o arquivo
            if (url) {
              this.fb2 = url;
              this.config.banner = this.fb;
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }


  carregar() {
    this.afs.firestore.collection('config').doc('config').get()
      .then((d) => {
        this.config = JSON.parse(JSON.stringify(d.data()));
      })

    //Listar pedidos em tempo real
    this.afs.collection('pedidos', ref => ref.orderBy('data', 'desc')).snapshotChanges().subscribe((r) => {
      let pedidos = [];
      r.forEach((rr) => {
        let item = rr.payload.doc.data()
        item['id'] = rr.payload.doc.id;
        pedidos.push(item);
      })
      console.log('pedidos', pedidos)


      this.pedidos = pedidos;
    })

  }

  ngOnInit() {
    // this.afAuth.signInAnonymously().then(() => {
    this.carregar()
    // })
  }

  aceitar(id) {
    this.afs.firestore.collection('pedidos').doc(id).update({ status: 'preparando' })
      .then(() => {
        this.carregar()
      })
  }

  recusar(id) {
    this.afs.firestore.collection('pedidos').doc(id).update({ status: 'recusado' })
      .then(() => {
        this.carregar()
      })
  }

  saiuEntrega(id) {
    this.afs.firestore.collection('pedidos').doc(id).update({ status: 'saiu para entrega' })
      .then(() => {
        this.carregar()
      })
  }

  finalizado(id) {
    this.afs.firestore.collection('pedidos').doc(id).update({ status: 'entregue' })
      .then(() => {
        this.carregar()
      })
  }

  salvar() {
    this.afs.firestore.collection('config').doc('config').update(this.config)
  }
}
