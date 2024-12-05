import { UserRole } from '@/users/entities/user.entity';
import {DestinationType} from "@/favorites/enums/favorite-type.enum";
import {CreatePhotonFeatureDto} from "@/photon-features/dto/create-photon-feature.dto";
import {CreateFavoriteDto} from "@/favorites/dto/create-favorite.dto";


const password1 = 'Test1234';
const passwordDelete1 = 'Delete1234';
const passwordDelete2 = 'Delete5678';
const passwordAdmin = 'Admin1234';

export const userData = {
    user: { email: 'e2e-user@example.com', password: password1, firstname: 'User', lastname: 'E2E', role: UserRole.USER },
    deletableUserOne: { email: 'e2e-deletableUserOne@example.com@example.com', password: passwordDelete1, firstname: 'DeleteUserOne', lastname: 'E2E', role: UserRole.USER },
    deletableUserTwo: { email: 'e2e-deletableUserTwo@example.com', password: passwordDelete2, firstname: 'DeleteUserTwo', lastname: 'E2E', role: UserRole.USER },
    adminUser: { email: 'e2e-admin@example.com', password: passwordAdmin, firstname: 'Admin', lastname: 'E2E', role: UserRole.ADMIN }
};
const photonFeatureData: CreatePhotonFeatureDto = {
    geometry: {
        coordinates: [
            13.0458657,
            52.4217389
        ],
        type: "Point"
    },
    type: "Feature",
    properties: {
        osm_id: 24423021, extent: [
            13.0454178,
            52.422333,
            13.0464939,
            52.4211595
        ],
        country: "Deutschland",
        city: "Potsdam",
        countrycode: "DE",
        postcode: "14469",
        locality: "Bornstedter Feld",
        type: "street",
        osm_type: "W",
        osm_key: "highway",
        district: "Bornstedt",
        osm_value: "living_street",
        name: "Salzmannweg",
        state: "Brandenburg"
    }
}
interface FavoritesData {
    [key: string]: CreateFavoriteDto
}
export const favoritesData: FavoritesData = {
    home:
        {
            name: "Home",
            destinationType: DestinationType.HOME,
            photonFeature: photonFeatureData
        },
    doctor:
        {
            name: "Doctor",
            destinationType: DestinationType.NORMAL,
            photonFeature: photonFeatureData
        },
    shops:
        {
            name: "Shops",
            destinationType: DestinationType.NORMAL,
            photonFeature: photonFeatureData
        },
    newFavorite:
        {
            name: "NewFavorite",
            destinationType: DestinationType.NORMAL,
            photonFeature: photonFeatureData
        },
    deletableFavoriteOne:
        {
            name: "DeletableFavoriteOne",
            destinationType: DestinationType.NORMAL,
            photonFeature: photonFeatureData
        },
    deletableFavoriteTwo:
        {
            name: "DeletableFavoriteTwo",
            destinationType: DestinationType.NORMAL,
            photonFeature: photonFeatureData
        }
}