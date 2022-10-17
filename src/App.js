import { useMemo, useState } from "react";
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from "@react-google-maps/api";

// Fontawesome library
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fal } from "@fortawesome/pro-light-svg-icons";
import { fad } from "@fortawesome/pro-duotone-svg-icons";
import { far } from "@fortawesome/pro-regular-svg-icons";

library.add(fab, fas, fal, fad, far);

const App = () => {

    const [errors, setErrors] = useState([]);
	const [positions, setPositions] = useState([
		{
			latitude: 46.55309574467675,
			longitude: 0.5677825643038148,
		},
	]);
	const watchId = navigator.geolocation.watchPosition(
		(position) => {
			console.log(position);
			const { latitude, longitude } = position.coords;
            setPositions((prev) => [...prev, { latitude, longitude }]);
		},
		(error) => {
			console.log(error);
            setErrors((prev) => [...prev, error]);
		},
	);

	const [activeMarker, setActiveMarker] = useState(null);

	console.log(positions);
	console.log(watchId);
	console.log(errors);

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: "AIzaSyAas1GIT6EFZpzBlF6-ypkhV6cd1KrhP00",
	});

	const position0 = useMemo(() => ({ lat: positions[0].latitude, lng: positions[0].longitude }), [positions]);

	const markers = [
		{
			id: 1,
			name: "Ma maison, Pouillé",
			description: "Victus universis caro ferina est lactisque abundans copia qua sustentantur, et herbae multiplices et siquae alites capi per aucupium possint, et plerosque mos vidimus frumenti usum et vini penitus ignorantes.",
			position: { lat: positions[0].latitude, lng: positions[0].longitude }
		},
		{
			id: 2,
			name: "Blue Com, Poitiers",
			description: "Victus universis caro ferina est lactisque abundans copia qua sustentantur, et herbae multiplices et siquae alites capi per aucupium possint, et plerosque mos vidimus frumenti usum et vini penitus ignorantes.",
			position: { lat: 46.5789618, lng: 0.3362834 }
		},
		{
			id: 3,
			name: "Los Angeles, California",
			description: "Victus universis caro ferina est lactisque abundans copia qua sustentantur, et herbae multiplices et siquae alites capi per aucupium possint, et plerosque mos vidimus frumenti usum et vini penitus ignorantes.",
			position: { lat: 46.579224, lng: 0.3365942 }
		},
		{
			id: 4,
			name: "New York, New York",
			description: "Victus universis caro ferina est lactisque abundans copia qua sustentantur, et herbae multiplices et siquae alites capi per aucupium possint, et plerosque mos vidimus frumenti usum et vini penitus ignorantes.",
			position: { lat: 46.5790839, lng: 0.3375974 }
		}
	];

	if (!isLoaded) return <div>Chargement ...</div>;

	const handleActiveMarker = (marker) => {
		if (marker === activeMarker) {
			return;
		}
		setActiveMarker(marker);
	};

	return (
		<GoogleMap zoom={13} center={position0} mapContainerClassName="map-container">
			{markers.map(({ id, name, description, position }) => (
        <MarkerF
			key={id}
			position={position}		
			onClick={() => handleActiveMarker(id)}
        >
			{activeMarker === id ? (
				<InfoWindowF onCloseClick={() => setActiveMarker(null)}>
					<>
						<div>{name}</div>
						<div>{description}</div>
					</>
				</InfoWindowF>
			) : null}
				</MarkerF>
			))}
		</GoogleMap>
	);
};

export default App;