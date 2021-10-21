import { Component, OnInit, OnDestroy } from "@angular/core";
import { BlizzardApiService } from "../services/blizzard-api.service";
import { Subscription } from "rxjs";

@Component({
    selector: "app-search-bar",
    templateUrl: "./search-bar.component.html",
    styleUrls: ["./search-bar.component.css"],
})
export class SearchBarComponent implements OnInit, OnDestroy {
    searchCharListSubscription: Subscription;
    searchCharList;
    options: any[] = [];
    searchEventActivated = true;
    selectedChar;

    constructor(private blizzardApiService: BlizzardApiService) {}

    ngOnInit() {
        this.searchCharList = this.blizzardApiService.searchCharList;
        this.searchCharListSubscription =
            this.blizzardApiService.searchCharListSubject.subscribe(
                (searchCharList) => {
                    this.searchCharList = searchCharList;
                }
            );
    }

    onFilter = (searchValue: string) => {
        this.selectedChar = null;

        if (searchValue.length >= 2) {
            this.options = [];

            this.searchCharList.filter((char) => {
                if (
                    char.name
                        .trim()
                        .toLowerCase()
                        .includes(searchValue.trim().toLowerCase()) &&
                    this.options.length < 10
                ) {
                    this.options.push(char);
                }
            });

            this.options.forEach((option, index) => {
                const url = `https://eu.api.blizzard.com/profile/wow/character/${
                    option.realm
                }/${option.name.toLowerCase()}?${this.blizzardApiService.getNamespaceParam(
                    "profile",
                    "eu"
                )}&${this.blizzardApiService.getLocaleParam(
                    "en_GB"
                )}&access_token=${this.blizzardApiService.token}`;

                fetch(encodeURI(url)).then((res) => {
                    res.json().then((data) => {
                        this.options[index] = {
                            ...option,
                            classId:
                                data.character_class && data.character_class.id,
                        };
                    });
                });
            });
        } else {
            this.options = [];
        }

        this.selectChar(searchValue);
    };

    searchDisabled = () => !(this.searchCharList.length > 0);

    selectChar = (searchValue) => {
        searchValue.trim();
        if (searchValue.match(/.+\-.+/g)) {
            if (searchValue.match(/.+\-.+/g)) {
                this.selectedChar = searchValue.split("-");

                if (this.selectedChar.length === 3) {
                    this.selectedChar.splice(
                        1,
                        2,
                        `${this.selectedChar[1]}-${this.selectedChar[2]}`
                    );
                }

                this.selectedChar[0] = this.selectedChar[0]
                    .trim()
                    .toLowerCase();
                this.selectedChar[1] = this.selectedChar[1]
                    .trim()
                    .toLowerCase();
            }
        }
    };

    getClass = (classId) => {
        switch (classId) {
            case 1:
                return "warrior";
            case 2:
                return "paladin";
            case 3:
                return "hunter";
            case 4:
                return "rogue";
            case 5:
                return "priest";
            case 6:
                return "deathknight";
            case 7:
                return "shaman";
            case 8:
                return "mage";
            case 9:
                return "warlock";
            case 10:
                return "monk";
            case 11:
                return "druid";
            case 12:
                return "demon_hunter";
            default:
                return "not-found";
        }
    };

    getClassColor = (classId) => {
        switch (classId) {
            case 1:
                return "#C79C6E";
            case 2:
                return "#F58CBA";
            case 3:
                return "#ABD473";
            case 4:
                return "#FFF569";
            case 5:
                return "#FFFFFF";
            case 6:
                return "#C41F3B";
            case 7:
                return "#0070DE";
            case 8:
                return "#69CCF0";
            case 9:
                return "#9482C9";
            case 10:
                return "#00FF96";
            case 11:
                return "#FF7D0A";
            case 12:
                return "#A330C9";
            default:
                return "#FFFFFF";
        }
    };

    onSearchChar = () => {
        this.blizzardApiService.charDetails = null;
        this.blizzardApiService.emitSubject(
            this.blizzardApiService.charDetailsSubject,
            this.blizzardApiService.charDetails
        );

        this.blizzardApiService.blizzardSingleCharRequest(
            this.selectedChar[1],
            this.selectedChar[0]
        );
    };

    ngOnDestroy(): void {
        this.searchCharListSubscription.unsubscribe();
    }
}
