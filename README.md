# WorganicTabV1

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


## Development server json

Run `json-server --watch db.json` for a dev server. Navigate to `http://localhost:3000/`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Abouts
Project créé par Johann Loreau
create le 2023/07/29
Modifié le 
Le but est de montré pas par pas la mise en place d'un project Angular.
Le project sera voué à évolué suivant les remaques et conseils des visiteurs.

## Project :
v14 - Tableau options filtre select
    - Ajout d'un filtre select (H/F).
        \src\app\component\users\users.component.ts
        {column: 'sexe', columnTitle: 'Sexe', type:'string', columnHidden: false,
            filter: true, filterType: 'select', 
            filterSelectData: ['All','Homme','Femme'], 
            filterSelectDefault: 'All', 
            filterSelectVide: 'All'
        },
    - Ajout de l'input select dans la vue :
       \src\app\shared\component\worg-table\worg-table.component.html
       <select formControlName="{{ column.column }}"...
    - Modification de la function filterKeyEvent.
        \src\app\shared\component\worg-table\worg-table.component.ts

## Infos plus :
   
## Update

## Historique :
Avant -> v13 - Tableau options filtre text - multiple
Après -> v15 - Tableau options filtre select - data

## Ressource :
    - Filtre :
    https://danielk.tech/home/angular-how-to-apply-filters-to-ngfor
    https://www.digitalocean.com/community/tutorials/js-filter-array-method-fr
