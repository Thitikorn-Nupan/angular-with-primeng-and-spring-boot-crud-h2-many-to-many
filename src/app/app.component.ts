import {Component, OnInit} from '@angular/core';
import {MenuItem, MenuItemCommandEvent} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  // Menu
  protected menuItems! : MenuItem[]

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        // Url works when you clicked it will go to url this case will be :4200/ **** And it will refresh page
        // url: '/'
        command: (event: MenuItemCommandEvent) => {
          this.onMenuClick(event)
        }
      },
      {
        label: 'Crud Many To Many',
        icon: 'pi pi-search',
        items: [
          {
            label: 'Actor',
            icon: 'pi pi-server',
            command: (event: MenuItemCommandEvent) => {
              this.onMenuClick(event)

            }
          },
          {
            label: 'Movie',
            icon: 'pi pi-server',
            command: (event: MenuItemCommandEvent) => {
              this.onMenuClick(event)
            }
          },
          {
            label: 'Actor & Movie',
            icon: 'pi pi-server',
            command: (event: MenuItemCommandEvent) => {
              this.onMenuClick(event)
            }
          },
        ]
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
        items: [
          {
            label: 'Github',
            url: 'https://github.com/thitikorn-nupan'
          },
          {
            label: 'LinkedIn',
            url: 'https://linkedin.com/in/thitikorn-nupan/'
          }
        ]
      }
    ]
  }

  private onMenuClick(event: MenuItemCommandEvent) {
    let path = ''
    switch (event.item?.label) {
      case 'Home':
        path = '/';
        break
      case 'Actor':
        path = '/to-do-actor';
        break
      case 'Movie':
        path = '/to-do-movie';
        break
      case 'Actor & Movie':
        path = '/to-do-actor-and-movie';
        break
    }
    this.router.navigate([path]);
  }

}
