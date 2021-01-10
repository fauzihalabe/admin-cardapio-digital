import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "app-categorias",
  templateUrl: "./categorias.component.html",
})
export class CategoriasComponent implements OnInit {
  categorias = [];
  novo: boolean = false;
  categoria = {
    titulo: null
  }
  color;


  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) { }

  carregar() {
    //Listar categorias
    this.afs.firestore.collection('categorias').get()
      .then((r) => {
        let categorias = [];
        r.forEach((rr) => {
          let obj = rr.data();
          obj['id'] = rr.id;
          categorias.push(obj);
        });

        this.categorias = categorias;
        // console.log(this.categorias);
      })
  }

  excluir(id){
    this.afs.firestore.collection('categorias').doc(id).delete()
    .then(() => {
      this.carregar()
    })
  }

  ngOnInit(): void {
    // this.afAuth.signInAnonymously();
    this.carregar()
  }

  adicionar() {
    if (this.categoria.titulo) {
      this.afs.firestore.collection('categorias').add(this.categoria)
        .then(() => {
          this.novo = false;
          this.carregar()
        })
    }
  }
}
