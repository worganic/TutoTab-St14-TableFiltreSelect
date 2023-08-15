import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgFor, NgIf } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';


// Interface : liste des elements d'une colonne de table :
export interface Listecolumn {
  column: string;// Nom de la colonne dans les datas.
  columnTitle: string;// Nom de la colonne affiché.
  type: string;// Type d'infos : [number/string/boolean].
  columnHidden: boolean;// Colonne non affiché (hidden).

  filter: boolean;// Filtre de la colonne [true/false].
  filterType: string; // Filtre : type : [text/select].
  filterSelectData: any;// Filtre : liste des données du select.
  filterSelectDefault: string;// Filtre : donnée par default.
  filterSelectVide: string;// Filtre : donnée par default si données vide.
}

@Component({
  selector: 'app-worg-table',
  templateUrl: './worg-table.component.html',
  styleUrls: ['./worg-table.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, WorgTableComponent, 
    FormsModule, ReactiveFormsModule
    ]
})
export class WorgTableComponent implements OnInit {

  // Récupération des options du tableau :
  @Input() tableOption!: any[];
  // Récupération des data :
  @Input() ELEMENT_DATA!: any[];// Données récupéré en asynchrone.

  // Appel pour récupération des data :
  @Output() newDataEvent = new EventEmitter<string>();
  
  // Actualisation de la zone infos.
  infoActualisation: boolean = false;

  // Data récupéré et affiché dans la vue.
  viewData!: any[];
  DATATAB!: any[];

  // Timer de réactualisation :
  interval: any | undefined;// Premier timer d'actualisation.
  interval2: any | undefined;// Second timer pour l'affichage des infos de maj.
  timeLeft: number = environment.timerUser;
  time = 0;

  // Table options : 
  tableAffichage: boolean = true;
  tableTimer: boolean = true;
  tableTimerTemps: number = environment.timerUser;
  filtre: boolean = true;

  // Input
  trest = "All";

  service: any;// Service récupéré.
  Listecolumns!: Listecolumn[]; // Initialisation de la liste des filtres :

  // Form
  form!: FormGroup<any>;

  /**
   * constructor
   * 
   * @param _fb 
   */
  constructor(
  ) { }

  /**
   * 
   */
  ngOnInit(): void {
    console.log('WorgTableComponent | ngOnInit');

    // Récupération des option du tableau :
   
    const option = this.tableOption[0];
    console.log('WorgTableComponent | ngOnInit / option :',option);
    this.tableAffichage = option['options']['affichage'];
    this.tableTimer =option['options']['timer'];
    this.tableTimerTemps = option['options']['timerTemps'];
    this.filtre = option['options']['filtre'];

    this.service =  option['service'];// Service utilisé.
    this.Listecolumns =  option['listeColumns'];// Liste des colonnes.
    // Récupération de l'option time si celle ci à été modifié.
    if(this.tableTimerTemps && this.timeLeft != this.tableTimerTemps)this.timeLeft = this.tableTimerTemps;

    // Mise en place des filtres :
    const group: any = {};
    Object.entries(this.Listecolumns).forEach(([key, value], index) => {
      console.log('WorgTableComponent | Object / value :',value);
      group[value.column] = new FormControl();
    });
    this.form = new FormGroup(group);
    /*
    username: new FormControl(),
    lastName: new FormControl(),
    sexe: new FormControl(),
 */
    // Récupération des employés :
    this.startTimer();
  }

  /**
   * 
   */
  ngOnDestroy() {
    if (this.interval) {
      console.log("WorgTableComponent | ngOnDestroy");
      clearInterval(this.interval);
    }
  }

  /**
   * 
   */
  startTimer() {
    this.time = this.timeLeft;
    //console.log("WorgTableComponent | startTimer / this.time", this.time);
    this.recupData();
    this.interval = setInterval(() => {
      //console.log("WorgTableComponent | startTimer /setInterval / this.time", this.time);
      if (this.time > 0) {
        this.time--;
      } else {
        //console.log("WorgTableComponent | startTimer");
        this.service.deleteCached();
        this.recupData();
        this.time = this.timeLeft;
      }
    }, 1000)
  }

  /**
   * 
   */
  majDonnees() {
    //console.log("> WorgTableComponent | majDonnees");
    this.time = 0;
  }

  /**
   * 
   */
  startTimerInfo() {
    var time = 5;
    //console.log("WorgTableComponent | startTimerInfo / time", time);
    this.interval2 = setInterval(() => {
      //console.log("WorgTableComponent | startTimerInfo / interval2 / time", time);
      if (time > 0) {
        time--;
      } else {
        //console.log("WorgTableComponent | startTimerInfo FIN");
        this.infoActualisation = false;
        time = 0;
        clearInterval(this.interval2);
      }
    }, 1000)
  }

  /**
   * 
   */
  recupData() {
    //console.log("WorgTableComponent / recupData");
    this.newDataEvent.emit('add');
  }

  // Function de Récupération des employés :
  majData(res: any) {
   // console.log("WorgTableComponent / majData");
        var isEqual = JSON.stringify(this.DATATAB) === JSON.stringify(res);

        if (!isEqual) {
          this.viewData = this.DATATAB = res;
          console.log("WorgTableComponent / majData / subscribe / res :", res);
          this.infoActualisation = true;
          this.startTimerInfo();
        } else {
          //console.log("WorgTableComponent / majData / subscribe / Pas de de MAJ");
          this.infoActualisation = false;
        }
  }

  /**
   * ngOnChanges
   * Si les données envoyé change :
   * 
   * ELEMENT_DATA
   */
  ngOnChanges() {
    // console.log("WorgTableComponent | ngOnChanges");

    // Check if the data exists before using it
    if (this.ELEMENT_DATA) {
      //console.log("WorgTableComponent | ngOnChanges / this.ELEMENT_DATA :", this.ELEMENT_DATA);
      this.majData(this.ELEMENT_DATA);

    }
  }

  /**
   * findHiddenFalse : Pipe d'affichage ou non des colonnes (option/colonne/columnHidden).
   * @param list Pip
   * @returns 
   */
  findHiddenFalse(list: any[]): any[] {
    //return list.filter(p => p.columnHidden === false);
    return list.filter(p => p.columnHidden === false);
  }

  result: any;
  /**
   * filterKeyEvent
   * @param event 
   */
  filterKeyEvent(){
    var testFilter = this.ELEMENT_DATA;
    
    // Récupération des infos des filtres :
    console.log("WorgTableComponent | filterKeyEvent / this.form.value :", this.form.value);
    Object.entries(this.form.value).forEach(([key, value], index) => {
      if(value != null && value != 'All'){
        testFilter = testFilter.filter(p => {
            const tt = p[key].toLowerCase();
            const tt2 =  value.toString().toLowerCase();
            return tt.includes(tt2);
          }
        );
      }
    });
    this.viewData = testFilter;
    console.log("WorgTableComponent | filterKeyEvent / testFilter :", testFilter);
  }

}
