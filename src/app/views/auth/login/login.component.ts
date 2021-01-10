import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router'; 
import firebase from 'firebase/app'

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {

  usuario = {
    email: null,
    senha: null
  }

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {

  }

  ngOnInit(): void {
  }

  fazerLogin() {
    console.log(this.usuario)
    //Logar no autentication
    this.afAuth.signInWithEmailAndPassword(this.usuario.email, this.usuario.senha).then(() => {
      this.afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
      console.log('logado')

      //Verificar se está cadastrado como admin
      this.afs.firestore.collection('admins').where('email', '==', this.usuario.email)
        .get()
        .then((r) => {
          let array = [];
          r.forEach((rr) => {
            array.push(rr.data());
          });
          
          if (array.length > 0) {
            

            //Acesso liberado
            this.router.navigate(['admin/dashboard']);
          }
          else {
            alert('Ops! Acesso não liberado');
          }
        })
    })
    .catch(() => {
      alert('Ops! Acesso não liberado');
    })
  }
}
