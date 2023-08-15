import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/services/users.service';
import { WorgTableComponent } from 'src/app/shared/component/worg-table/worg-table.component';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, WorgTableComponent, CommonModule]
})
export class UsersComponent implements OnInit {

  // Données du tableau :
  dataAsync$: Observable<any> | undefined;

  // Options du tableau :
  tableOption!: any[];
  options: any = {
    'affichage': true,// Affichage de app-worg-table.
    'timer': true,// Utilisation ou non du timer.
    'timerTemps': 60,// Temps du timer (réactualisation des données).
    'filtre': true,// Affichage de la ligne filtre.
  };
  // Liste des colonnes et leur options :
  listeColumns: any[] = [
    {column: 'id', columnTitle: 'id.', type:'number', columnHidden: false},
    {column: 'username', columnTitle: 'Login', type:'string', columnHidden: false,
      filter: true, filterType: 'text'},
    {column: 'firstName', columnTitle: 'Prénom', type:'string', columnHidden: false},
    {column: 'lastName', columnTitle: 'Nom', type:'string', columnHidden: false,
      filter: true, filterType: 'text'},
    {column: 'age', columnTitle: 'Age', type:'string', columnHidden: false},
    {column: 'sexe', columnTitle: 'Sexe', type:'string', columnHidden: false,
      filter: true, filterType: 'select', 
      filterSelectData: ['All','Homme','Femme'], 
      filterSelectDefault: 'All', 
      filterSelectVide: 'All'
    },
    {column: 'country', columnTitle: 'Pays', type:'string', columnHidden: true},
    {column: 'password', columnTitle: 'Mot de passe', type:'string', columnHidden: false},
  ];
  
  /**
   * constructor
   * 
   * @param _usersService 
   * @param _fb 
   */
  constructor(
    private _usersService: UsersService,// Service.
  ) { }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    //console.log('UsersComponent / ngOnInit');

    // Liste des options :
    this.tableOption = [{
        options: this.options,// Options.
        service:  this._usersService,// Service envoyé à app-worg-table.
        listeColumns: this.listeColumns,// Liste des filtres.
      }
    ];
  }

  /**
   * Récupération des données :
   */ 
  getData() {
    //console.log("UsersComponent / getData");
    this.dataAsync$ = this._usersService.geUsers().pipe(
      map((jsonArray: any) => {
        //console.log("UsersComponent / getData / res :", jsonArray);
        return jsonArray;
      })
    );
  }

}
