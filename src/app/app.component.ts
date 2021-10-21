import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { BlizzardApiService } from "./services/blizzard-api.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
    isFetchingLadderSubscription: Subscription;

    constructor(private blizzardApiService: BlizzardApiService) {}

    ngOnInit(): void {
        this.blizzardApiService
            .getToken()
            .then((res) => {
                res.json().then((tokenRes) => {
                    console.log(tokenRes);

                    this.blizzardApiService.token = tokenRes.access_token;

                    // this.blizzardApiService.blizzardWowServersRequest();
                    this.blizzardApiService.blizzardLaddersRequest();

                    // this.blizzardApiService.isFetchingLaddersSubject.subscribe(
                    //     (isFetching) => {
                    //         if (!isFetching) {
                    //             this.blizzardApiService.blizzardSingleCharRequest(
                    //                 this.blizzardApiService.ladders["3v3"][0]
                    //                     .character.realm.slug,
                    //                 this.blizzardApiService.ladders[
                    //                     "3v3"
                    //                 ][0].character.name.toLowerCase()
                    //             );
                    //         }
                    //     }
                    // );
                });
            })
            .catch((err) => console.log(err));
    }

    ngOnDestroy() {
        this.isFetchingLadderSubscription.unsubscribe();
    }
}
