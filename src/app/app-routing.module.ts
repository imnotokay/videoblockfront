import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActoresComponent } from './pages/actores/actores.component';
import { HomeComponent } from './pages/home/home.component';
import { PeliculasComponent } from './pages/peliculas/peliculas.component';
import { ReservasComponent } from './pages/reservas/reservas.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';


const routes: Routes = [
  { component: HomeComponent, path: 'inicio', data: { title: 'Inicio' } },
  { component: PeliculasComponent, path: 'peliculas', data: { title: 'Peliculas' } },
  { component: ActoresComponent, path: 'actores', data: { title: 'Actores' } },
  { component: UsuariosComponent, path: 'usuarios', data: { title: 'Usuarios' } },
  { component: ReservasComponent, path: 'devolucion', data: { title: 'Devolución' } },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
