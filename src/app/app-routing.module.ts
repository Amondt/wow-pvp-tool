import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ServerListComponent } from "./server-list/server-list.component";
import { CharDetailsComponent } from "./char-details/char-details.component";

const routes: Routes = [
    // { path: "char", component: CharDetailsComponent },
    { path: "", component: CharDetailsComponent },
    { path: "realms-status", component: ServerListComponent },
    { path: "**", redirectTo: "" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
