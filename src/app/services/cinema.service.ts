import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  public host: String = "http://localhost:8080";

  constructor(private http:HttpClient) { }

  public getVilles(){
    return this.http.get(this.host+"/villes");
  }

  getCinemasByVille(ville: any) {
    return this.http.get(ville['_links']['cinemas']['href']);
  }

  getSallesByCinema(cinema: any) {
    let new_var = "something";
    return this.http.get(cinema['_links']['salles']['href']);
  }

  getFilmProjectionBySalle(salle: any) {
    let url = salle['_links']['filmProjections']['href'].replace("{?projection}", "");
    return this.http.get(url+"?projection=filmProj");
  }

  getTicketsByFilmProjection(filmProjection: any) {
    let url = filmProjection['_links']['tickets']['href'].replace("{?projection}", "");
    return this.http.get(url+"?projection=ticketProj");
  }

  payerTickets(ticketForm: any) {
    return this.http.post(this.host+'/paiement', ticketForm);
  }
}
