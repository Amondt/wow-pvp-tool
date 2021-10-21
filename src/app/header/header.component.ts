import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
    colorTheme = "deep-purple-amber";
    isDarkTheme = true;
    themeColorsList = [
        // { name: 'red',          hexa: '#F44336'},
        // { name: 'pink',         hexa: '#E91E63'},
        // { name: 'purple',       hexa: '#9C27B0'},
        // { name: 'deep-purple',  hexa: '#673AB7'},
        // { name: 'indigo',       hexa: '#3F51B5'},
        // { name: 'blue',         hexa: '#2196F3'},
        // { name: 'light-blue',   hexa: '#03A9F4'},
        // { name: 'cyan',         hexa: '#00BCD4'},
        // { name: 'teal',         hexa: '#009688'},
        // { name: 'green',        hexa: '#4CAF50'},
        // { name: 'light-green',  hexa: '#8BC34A'},
        // { name: 'lime',         hexa: '#CDDC39'},
        // { name: 'yellow',       hexa: '#FFEB3B'},
        // { name: 'amber',        hexa: '#FFC107'},
        // { name: 'orange',       hexa: '#FF9800'},
        // { name: 'deep-orange',  hexa: '#FF5722'},
        // { name: 'brown',        hexa: '#795548'},
        {
            name: "deep-purple-amber",
            hexa: "#673AB7",
            tooltip: "Deep Purple & Amber",
        },
        { name: "indigo-pink", hexa: "#3F51B5", tooltip: "Indigo & Pink" },
        {
            name: "pink-blue-grey",
            hexa: "#E91E63",
            tooltip: "Pink & Blue-grey",
        },
        { name: "purple-green", hexa: "#9C27B0", tooltip: "Purple & Green" },
    ];

    constructor() {}

    ngOnInit() {}

    onToggleTheme = () => {
        this.isDarkTheme = !this.isDarkTheme;
        this.updateDomClassTheme();
    };

    onChangeColorTheme = (color) => {
        this.colorTheme = color;
        this.updateDomClassTheme();
    };

    updateDomClassTheme = () => {
        const bodyNode = document.querySelector("body");
        let mainTheme = this.isDarkTheme ? "-dark-theme" : "-light-theme";
        bodyNode.className =
            this.colorTheme + mainTheme + " mat-app-background";
    };
}
