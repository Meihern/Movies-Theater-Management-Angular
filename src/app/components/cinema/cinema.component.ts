import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CinemaService} from '../../services/cinema.service';
import {host} from '@angular-devkit/build-angular/src/test-utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes: any;
  public cinemasByVille: any;
  public currentVille: any;
  public currentCinema: any;
  public sallesByCinema: any;
  public currentFilmProjection: any;
  public selectedTickets : any[];

  constructor(private cinemaService: CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(data=>{
        this.villes = data['_embedded']['villes'];
      }, error => {
        console.log("An error of "+error+" has occurred");
      })
  }

  onGetCinemasByVille(ville: any) {
    this.currentVille = ville;
    this.sallesByCinema = null;
    this.cinemaService.getCinemasByVille(ville)
      .subscribe(data=>{
        this.cinemasByVille = data['_embedded']['cinemas'];
      }, error => {
        console.log("An error of "+error+" has occurred !");
      });
  }

  onGetSallesByCinema(cinema: any) {
    this.currentCinema = cinema;
    this.currentFilmProjection = null;
    this.cinemaService.getSallesByCinema(cinema)
      .subscribe(data=>{
        this.sallesByCinema = data['_embedded']['salles'];
        this.sallesByCinema.forEach(salle=>{
          this.cinemaService.getFilmProjectionBySalle(salle)
            .subscribe(data=>{
                salle.filmProjections=data['_embedded']['filmProjections'];
                salle.filmProjections.forEach(projection=>{
                  projection.film.image = this.cinemaService.host+'/films/imagefilm/'+projection.film['id'];
                });
            }, error => {
              console.log("An error of "+error+" has occurred !");
            })
        });
      }, error => {

      });
  }

  onGetTicketsByFilmProjection(filmProjection: any) {
    this.currentFilmProjection = filmProjection;
    this.cinemaService.getTicketsByFilmProjection(filmProjection)
      .subscribe(data=>{
        this.currentFilmProjection.tickets=data['_embedded']['tickets'];
        this.selectedTickets = [];
      }, error => {
        console.log("An error of "+error+" has occurred !");
      })
  }

  onSelectedTicket(ticket: any) {
    if (!ticket.selected){
      ticket.selected = true;
      this.selectedTickets.push(ticket);
    }
    else {
      ticket.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(ticket), 1);
    }
  }

  getTicketStatus(ticket: any) {
   let className = "btn";
    if(ticket.reservee){
      className = className + " btn-secondary";
    }else if(ticket.selected){
      className = className + " btn-warning";
    }
    else {
      className = className + " btn-success";
    }
    return className;
  }

  onPayTickets(dataForm) {
    let idTicketList :any = [];
    this.selectedTickets.forEach(selectedTicket=>{
      idTicketList.push(selectedTicket.id);
    });
    dataForm.idTicketList = idTicketList;
    this.cinemaService.payerTickets(dataForm)
      .subscribe(res=>{
        Swal.fire(
          'Succès',
          'Votre résérvation des tickets a été effectuée avec succès',
          'success'
        );
        this.onGetTicketsByFilmProjection(this.currentFilmProjection);
      }, error => {
        Swal.fire(
          'Echec',
          'Une erreur est survenue dans la résérvation, veuillez vérifier vos informations',
          'error'
        );
      })
  }
}
