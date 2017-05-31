import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {RegistrationService} from '../Shared/registration.service';
import {Guild} from '../Shared/models/guild.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Registration} from '../Shared/models/registration.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  registrationForm: FormGroup;
  guilds: Guild[] = [];
  addRegistrationStatus = true;

  constructor(public navCtrl: NavController, private registrationService: RegistrationService, private formBuilder: FormBuilder, private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      membershipNumber: ['', Validators.required],
      hours: ['', Validators.required],
      guild: ['', Validators.required],
      date: ['', Validators.required]
    })

    this.registrationService.getGuilds()
      .subscribe(
        (guilds) => this.guilds = guilds,
        (error) => {throw new Error(error);}
      )
  }

  onSubmit() {
    const volunteerId = this.registrationForm.get('membershipNumber').value;
    const hours = this.registrationForm.get('hours').value;
    const guildId = this.registrationForm.get('guild').value.GuildId;
    const date = this.registrationForm.get('date').value;
    const registration = new Registration(hours, date, guildId, volunteerId);

    this.registrationService.addRegistration(registration).subscribe(
      (success) => this.displayMessage('Din registrering er blevet behandlet, tusind tak for din indsats'),
      (error) => this.displayMessage('Hov, der opstod en fejl'),
      () => console.log('registrationService.addRegistration() complete')
    );
    this.registrationForm.reset();
  }

  displayMessage(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
