import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class BlizzardApiService {
    token: string;

    // Blizzard curl tokken request
    // curl -u bf6f035b9f8440a5a44bf687a21cbfff:yqPUyJ4xx62E747N2v9IXFa22XLFebLZ -d grant_type=client_credentials https://us.battle.net/oauth/token

    // char infos
    // https://eu.api.blizzard.com/wow/character/outland/frostyjackyy?fields=talents,pvp,guild,titles,professions,items,achievements&locale=en_EU&access_token=US0iCiqsk1z2U01T2nYm17ZtxWuPjdPLvc

    // ladder
    // https://eu.api.blizzard.com/wow/leaderboard/3v3?access_token=

    // render images
    // http://render-eu.worldofwarcraft.com/character/outland/125/130301821-inset.jpg
    // https://render-eu.worldofwarcraft.com/icons/56/ivn_cape_legionquest100_b_04.jpg

    // talents + pvp talents
    // https://eu.api.blizzard.com/profile/wow/character/outland/frostyjackyy/specializations?namespace=profile-eu&access_token=

    isFetchingServers: boolean;
    isFetchingServersSubject = new Subject<boolean>();

    serverList: any[] = [];
    serverListSubject = new Subject<any[]>();

    isFetchingCharDetails: any;
    isFetchingCharDetailsSubject = new Subject<boolean>();

    charDetails: any;
    charDetailsSubject = new Subject<any>();

    isFetchingLadders: boolean;
    isFetchingLaddersSubject = new Subject<boolean>();

    ladders: any[] = [];
    laddersSubject = new Subject<any[]>();

    searchCharList: any[] = [];
    searchCharListSubject = new Subject<any[]>();

    constructor() {}

    getToken = () => {
        return fetch("https://us.battle.net/oauth/token", {
            body: "grant_type=client_credentials",
            headers: {
                Authorization:
                    "Basic YmY2ZjAzNWI5Zjg0NDBhNWE0NGJmNjg3YTIxY2JmZmY6eXFQVXlKNHh4NjJFNzQ3TjJ2OUlYRmEyMlhMRmViTFo=",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
        });
    };

    emitSubject = (subject: Subject<any>, value: any) => {
        subject.next(value);
    };

    getNamespaceParam = (category: string, region: string) =>
        `namespace=${category.toLowerCase()}-${region.toLowerCase()}`;

    getLocaleParam = (locale: string) => `locale=${locale}`;

    blizzardWowServersRequest = () => {
        this.isFetchingServers = true;
        this.emitSubject(this.isFetchingServersSubject, this.isFetchingServers);

        fetch(
            `https://eu.api.blizzard.com/data/wow/connected-realm/index?${this.getNamespaceParam(
                "dynamic",
                "eu"
            )}&${this.getLocaleParam("en_GB")}&access_token=${this.token}`
        ).then((res) => {
            res.json().then((data) => {
                const serverList = [];
                Promise.all(
                    data.connected_realms.map((realm) => {
                        fetch(
                            realm.href +
                                "&locale=en_EU&access_token=" +
                                this.token
                        ).then((connectedRealmsRes) => {
                            connectedRealmsRes
                                .json()
                                .then((connectedRealmsData) => {
                                    serverList.push({
                                        status: connectedRealmsData.status.type,
                                        language:
                                            this.transformToReadableLanguage(
                                                connectedRealmsData.realms[0]
                                                    .locale
                                            ),
                                        name: connectedRealmsData.realms[0]
                                            .slug,
                                        population:
                                            connectedRealmsData.population.type,
                                        timezone:
                                            connectedRealmsData.realms[0]
                                                .timezone,
                                    });
                                });
                        });
                    })
                ).then(() => {
                    setTimeout(() => {
                        this.serverList = serverList;
                        this.emitSubject(
                            this.serverListSubject,
                            this.serverList
                        );

                        this.isFetchingServers = false;
                        this.emitSubject(
                            this.isFetchingServersSubject,
                            this.isFetchingServers
                        );
                    }, 1000);
                });
            });
        });
    };

    transformToReadableLanguage = (locale: string) => {
        switch (locale) {
            case "deDE":
                return "German";
            case "enGB":
                return "English";
            case "ptPT":
                return "Portugese";
            case "ruRU":
                return "Russian";
            case "frFR":
                return "French";
            case "esES":
                return "Spanish";
            case "itIT":
                return "Italian";
            default:
                return locale;
        }
    };

    blizzardSingleCharRequest = (realm, name) => {
        this.isFetchingCharDetails = true;
        this.emitSubject(
            this.isFetchingCharDetailsSubject,
            this.isFetchingCharDetails
        );

        const url = `https://eu.api.blizzard.com/profile/wow/character/${realm}/${name}?${this.getNamespaceParam(
            "profile",
            "eu"
        )}&${this.getLocaleParam("en_GB")}&access_token=${this.token}`;
        fetch(encodeURI(url)).then((res) => {
            res.json().then((data) => {
                const newCharDetails = data;

                const fetchMedia = fetch(
                    `${data.media.href}&${this.getLocaleParam(
                        "en_GB"
                    )}&access_token=${this.token}`
                );

                const fetchProfession = fetch(
                    `${data.professions.href}&${this.getLocaleParam(
                        "en_GB"
                    )}&access_token=${this.token}`
                );

                const fetchPvpSummary = fetch(
                    `${data.pvp_summary.href}&access_token=${this.token}`
                );

                const fetchSpecializations = fetch(
                    `${data.specializations.href}&${this.getLocaleParam(
                        "en_GB"
                    )}&access_token=${this.token}`
                );

                const fetchAchievementsStatistics = fetch(
                    `${data.achievements_statistics.href}&${this.getLocaleParam(
                        "en_GB"
                    )}&access_token=${this.token}`
                );

                const fetchStatistics = fetch(
                    `${data.statistics.href}&${this.getLocaleParam(
                        "en_GB"
                    )}&access_token=${this.token}`
                );

                const fetchEquipment = fetch(
                    `${data.equipment.href}&${this.getLocaleParam(
                        "en_GB"
                    )}&access_token=${this.token}`
                );

                Promise.all([
                    fetchMedia,
                    fetchProfession,
                    fetchPvpSummary,
                    fetchSpecializations,
                    fetchAchievementsStatistics,
                    fetchStatistics,
                    fetchEquipment,
                ])
                    .then(
                        ([
                            resMedia,
                            resProfessions,
                            resPvpSummary,
                            resSpecializations,
                            resAchievementsStatistics,
                            resStatistics,
                            resEquipment,
                        ]) => {
                            return Promise.all([
                                resMedia.json(),
                                resProfessions.json(),
                                resSpecializations.json(),
                                resAchievementsStatistics.json(),
                                resStatistics.json(),
                                resEquipment.json(),
                                resPvpSummary.json(),
                            ]);
                        }
                    )
                    .then(
                        ([
                            mediaData,
                            professionsData,
                            specializationsData,
                            achievementsStatisticsData,
                            statisticsData,
                            equipmentData,
                            pvpSummaryData,
                        ]) => {
                            newCharDetails.media = {
                                ...data.media,
                                assets: mediaData.assets,
                            };

                            newCharDetails.professions = {
                                ...data.professions,
                                primaries: professionsData.primaries,
                                secondaries: professionsData.secondaries,
                            };

                            newCharDetails.specializations = {
                                ...data.specializations,
                                ...specializationsData,
                            };

                            newCharDetails.achievements_statistics = {
                                ...data.achievements_statistics,
                                ...achievementsStatisticsData,
                            };

                            newCharDetails.statistics = {
                                ...newCharDetails.statistics,
                                ...statisticsData,
                            };

                            equipmentData.equipped_items =
                                equipmentData.equipped_items.map(
                                    (equippedItem) => {
                                        return {
                                            ...equippedItem,
                                            isOverlayOpen: false,
                                        };
                                    }
                                );

                            newCharDetails.equipment = {
                                ...newCharDetails.equipment,
                                ...equipmentData,
                            };

                            const equipmentDataFetchIconList = [];
                            equipmentData.equipped_items.forEach(
                                (equipedItem) => {
                                    equipmentDataFetchIconList.push(
                                        fetch(
                                            `${
                                                equipedItem.media.key.href
                                            }&${this.getLocaleParam(
                                                "en_GB"
                                            )}&access_token=${this.token}`
                                        )
                                    );
                                }
                            );

                            setTimeout(() => {
                                Promise.all(equipmentDataFetchIconList)
                                    .then((equipmentsMediaRes) => {
                                        const resArray = [];
                                        equipmentsMediaRes.forEach(
                                            (singleRes) => {
                                                resArray.push(singleRes.json());
                                            }
                                        );
                                        return Promise.all(resArray);
                                    })
                                    .then((equipmentMediaData) => {
                                        newCharDetails.equipment = {
                                            ...newCharDetails.equipment,
                                            ...equipmentData,
                                        };

                                        newCharDetails.equipment.equipped_items =
                                            newCharDetails.equipment.equipped_items.map(
                                                (equippedItem, index) => {
                                                    return (equippedItem = {
                                                        ...equippedItem,
                                                        media: {
                                                            ...equippedItem.media,
                                                            value: equipmentMediaData[
                                                                index
                                                            ].assets[0].value,
                                                        },
                                                    });
                                                }
                                            );

                                        this.charDetails = newCharDetails;
                                        this.emitSubject(
                                            this.charDetailsSubject,
                                            this.charDetails
                                        );
                                    });
                            }, 0);

                            const getFetchPvpBrackets = (brackets: any[]) => {
                                const fetchPvpBracketsList = [];
                                brackets.forEach((bracket) => {
                                    fetchPvpBracketsList.push(
                                        fetch(
                                            `${bracket.href}&access_token=${this.token}`
                                        )
                                    );
                                });
                                return fetchPvpBracketsList;
                            };

                            Promise.all(
                                getFetchPvpBrackets(pvpSummaryData.brackets)
                            )
                                .then((resFetchPvpBrackets) => {
                                    const resArrayJsonPromise = (resArray) => {
                                        const jsonPromiseArray = [];
                                        resArray.forEach((singleRes) => {
                                            jsonPromiseArray.push(
                                                singleRes.json()
                                            );
                                        });
                                        return jsonPromiseArray;
                                    };

                                    return Promise.all(
                                        resArrayJsonPromise(resFetchPvpBrackets)
                                    );
                                })
                                .then((resArrayData) => {
                                    newCharDetails.pvp_summary = {
                                        ...newCharDetails.pvp_summary,
                                        ...pvpSummaryData,
                                        brackets: resArrayData,
                                    };

                                    this.charDetails = newCharDetails;
                                    this.emitSubject(
                                        this.charDetailsSubject,
                                        this.charDetails
                                    );
                                });

                            const getFetchTalentsIcons = (talents: any[]) => {
                                const fetchTalentsList = [];
                                talents.forEach((talent) => {
                                    fetchTalentsList.push(
                                        fetch(
                                            `${
                                                talent.selected
                                                    ? talent.selected
                                                          .spell_tooltip.spell
                                                          .key.href
                                                    : talent.spell_tooltip.spell
                                                          .key.href
                                            }&${this.getLocaleParam(
                                                "en_GB"
                                            )}&access_token=${this.token}`
                                        )
                                    );
                                });
                                return fetchTalentsList;
                            };

                            setTimeout(() => {
                                specializationsData.specializations.forEach(
                                    (specialization, index) => {
                                        // Get talents icons (pve / pvp) url's
                                        if (
                                            specialization.talents &&
                                            specialization.pvp_talent_slots
                                        ) {
                                            Promise.all(
                                                getFetchTalentsIcons([
                                                    ...specialization.talents,
                                                    ...specialization.pvp_talent_slots,
                                                ])
                                            ).then((resTalentsList) => {
                                                Promise.all(
                                                    resTalentsList.map(
                                                        (talentRes) =>
                                                            talentRes.json()
                                                    )
                                                )
                                                    .then((talentsListData) => {
                                                        const fetchDetailedTalentsList =
                                                            [];
                                                        talentsListData.forEach(
                                                            (talentDetail) => {
                                                                fetchDetailedTalentsList.push(
                                                                    fetch(
                                                                        `${
                                                                            talentDetail
                                                                                .media
                                                                                .key
                                                                                .href
                                                                        }&${this.getLocaleParam(
                                                                            "en_GB"
                                                                        )}&access_token=${
                                                                            this
                                                                                .token
                                                                        }`
                                                                    )
                                                                );
                                                            }
                                                        );

                                                        Promise.all(
                                                            fetchDetailedTalentsList
                                                        ).then(
                                                            (
                                                                resTalentsMediaList
                                                            ) => {
                                                                Promise.all(
                                                                    resTalentsMediaList.map(
                                                                        (
                                                                            resTalentMedia
                                                                        ) =>
                                                                            resTalentMedia.json()
                                                                    )
                                                                ).then(
                                                                    (
                                                                        talentMedia
                                                                    ) => {
                                                                        const pveTalentsList =
                                                                            newCharDetails
                                                                                .specializations
                                                                                .specializations[
                                                                                index
                                                                            ]
                                                                                .talents;
                                                                        const pvpTalentsList =
                                                                            newCharDetails
                                                                                .specializations
                                                                                .specializations[
                                                                                index
                                                                            ]
                                                                                .pvp_talent_slots;

                                                                        for (
                                                                            let i = 0,
                                                                                j =
                                                                                    pveTalentsList.length +
                                                                                    pvpTalentsList.length -
                                                                                    1;
                                                                            i <
                                                                            pveTalentsList.length +
                                                                                pvpTalentsList.length;
                                                                            i++,
                                                                                j--
                                                                        ) {
                                                                            if (
                                                                                i <
                                                                                pveTalentsList.length
                                                                            ) {
                                                                                pveTalentsList[
                                                                                    i
                                                                                ] =
                                                                                    {
                                                                                        ...pveTalentsList[
                                                                                            i
                                                                                        ],
                                                                                        media: talentMedia[
                                                                                            i
                                                                                        ]
                                                                                            .assets[0]
                                                                                            .value,
                                                                                        isOverlayOpen:
                                                                                            false,
                                                                                    };
                                                                            } else {
                                                                                pvpTalentsList[
                                                                                    j
                                                                                ].selected =
                                                                                    {
                                                                                        ...pvpTalentsList[
                                                                                            j
                                                                                        ]
                                                                                            .selected,
                                                                                        media: talentMedia[
                                                                                            i
                                                                                        ]
                                                                                            .assets[0]
                                                                                            .value,
                                                                                        isOverlayOpen:
                                                                                            false,
                                                                                    };
                                                                            }
                                                                        }
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    })
                                                    .catch((err) =>
                                                        console.log(err)
                                                    );
                                            });
                                        }

                                        // get spec icons url's + role
                                        fetch(
                                            `${
                                                specialization.specialization
                                                    .key.href
                                            }&${this.getLocaleParam(
                                                "en_GB"
                                            )}&access_token=${this.token}`
                                        ).then((resSingleSpe) => {
                                            resSingleSpe
                                                .json()
                                                .then((singleSpeData) => {
                                                    newCharDetails.specializations.specializations[
                                                        index
                                                    ].specialization = {
                                                        ...newCharDetails
                                                            .specializations
                                                            .specializations[
                                                            index
                                                        ].specialization,
                                                        role: singleSpeData.role,
                                                    };

                                                    fetch(
                                                        `${
                                                            singleSpeData.media
                                                                .key.href
                                                        }&${this.getLocaleParam(
                                                            "en_GB"
                                                        )}&access_token=${
                                                            this.token
                                                        }`
                                                    ).then(
                                                        (resSingleSpeMedia) => {
                                                            resSingleSpeMedia
                                                                .json()
                                                                .then(
                                                                    (
                                                                        singleSpeMediaData
                                                                    ) => {
                                                                        newCharDetails.specializations.specializations[
                                                                            index
                                                                        ].specialization =
                                                                            {
                                                                                ...newCharDetails
                                                                                    .specializations
                                                                                    .specializations[
                                                                                    index
                                                                                ]
                                                                                    .specialization,
                                                                                media: singleSpeMediaData
                                                                                    .assets[0]
                                                                                    .value,
                                                                            };
                                                                    }
                                                                );
                                                        }
                                                    );
                                                });
                                        });
                                    }
                                );
                            }, 0);

                            this.charDetails = newCharDetails;
                            this.emitSubject(
                                this.charDetailsSubject,
                                this.charDetails
                            );

                            this.isFetchingCharDetails = false;
                            this.emitSubject(
                                this.isFetchingCharDetailsSubject,
                                this.isFetchingCharDetails
                            );
                        }
                    );
            });
        });
    };

    blizzardLaddersRequest = () => {
        this.isFetchingLadders = true;
        this.emitSubject(this.isFetchingLaddersSubject, this.isFetchingLadders);

        const v3 = this.blizzardSingleBracketRequest("3v3");
        const v2 = this.blizzardSingleBracketRequest("2v2");
        const rbg = this.blizzardSingleBracketRequest("rbg");

        Promise.all([v2, v3, rbg]).then(() => {
            // add all chars to the search list
            const brackets = ["3v3", "2v2", "rbg"];
            for (const bracket of brackets) {
                this.searchCharList.push(
                    ...this.ladders[bracket].map((char) => {
                        return {
                            name: char.character.name,
                            realm: char.character.realm.slug,
                            faction: char.faction.type,
                            ranking: char.rank,
                            classId: null,
                        };
                    })
                );
            }

            // sort them by ranking
            this.searchCharList.sort((current, next) =>
                current.ranking > next.ranking ? 1 : -1
            );

            // remove duplicates (same char in different brackets)
            this.searchCharList = [
                ...new Set(this.searchCharList.map((char) => char.name)),
            ].map((name) =>
                this.searchCharList.find((char) => char.name === name)
            );

            this.isFetchingLadders = false;
            this.emitSubject(
                this.isFetchingLaddersSubject,
                this.isFetchingLadders
            );

            this.emitSubject(this.laddersSubject, this.ladders);
            this.emitSubject(this.searchCharListSubject, this.searchCharList);
        });
    };

    blizzardSingleBracketRequest = (bracket: string) => {
        return new Promise((resolve, reject) => {
            fetch(
                `https://eu.api.blizzard.com/data/wow/pvp-season/30/pvp-leaderboard/${bracket}?${this.getNamespaceParam(
                    "dynamic",
                    "eu"
                )}&${this.getLocaleParam("en_GB")}&access_token=${this.token}`
            )
                .then((res) => {
                    res.json().then((data) => {
                        this.ladders[bracket] = data.entries;
                        resolve(data);
                    });
                })
                .catch(() => reject());
        });
    };
}
