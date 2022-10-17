import { useMemo, useState } from "react";
import {
	Autocomplete,
	DirectionsRenderer,
	GoogleMap,
	useLoadScript,
	MarkerF,
	InfoWindowF,
} from "@react-google-maps/api";

// Fontawesome library
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fal } from "@fortawesome/pro-light-svg-icons";
import { fad } from "@fortawesome/pro-duotone-svg-icons";
import { far } from "@fortawesome/pro-regular-svg-icons";

library.add(fab, fas, fal, fad, far);

const App = () => {
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
	});

	const [map, setMap] = useState(/** @type google.maps.Map */ (null));
	const [directionsResponse, setDirectionsResponse] = useState(null);
	const [distance, setDistance] = useState("");
	const [duration, setDuration] = useState("");

	const [origin, setOrigin] = useState({
		lat: 46.55309574467675,
		lng: 0.5677825643038148,
	});
	const [destination, setDestination] = useState({
		lat: 46.5785563,
		lng: 0.2630183,
	});

	const [errors, setErrors] = useState([]);
	const [positions, setPositions] = useState([
		{
			lat: 46.55309574467675,
			lng: 0.5677825643038148,
		},
	]);
	// const watchId = navigator.geolocation.watchPosition(
	// 	(position) => {
	// 		// console.log(position);
	// 		const { lat, lng } = position.coords;
	// 		setPositions((prev) => [...prev, { lat, lng }]);
	// 	},
	// 	(error) => {
	// 		console.log(error);
	// 		setErrors((prev) => [...prev, error]);
	// 	}
	// );

	const [activeMarker, setActiveMarker] = useState(null);

	const position0 = useMemo(
		() => ({ lat: positions[0].lat, lng: positions[0].lng }),
		[positions]
	);

	const markers = [
		{
			id: 3,
			name: "Blue Com, Poitiers",
			description:
				"Victus universis caro ferina est lactisque abundans copia qua sustentantur, et herbae multiplices et siquae alites capi per aucupium possint, et plerosque mos vidimus frumenti usum et vini penitus ignorantes.",
			position: { lat: 46.5789618, lng: 0.3362834 },
		},
		{
			id: 4,
			name: "Los Angeles, California",
			description:
				"Victus universis caro ferina est lactisque abundans copia qua sustentantur, et herbae multiplices et siquae alites capi per aucupium possint, et plerosque mos vidimus frumenti usum et vini penitus ignorantes.",
			position: { lat: 46.579224, lng: 0.3365942 },
		},
		{
			id: 5,
			name: "New York, New York",
			description:
				"Victus universis caro ferina est lactisque abundans copia qua sustentantur, et herbae multiplices et siquae alites capi per aucupium possint, et plerosque mos vidimus frumenti usum et vini penitus ignorantes.",
			position: { lat: 46.5790839, lng: 0.3375974 },
		},
	];

	if (!isLoaded) return <div>Chargement ...</div>;

	const handleActiveMarker = (marker) => {
		if (marker === activeMarker) {
			return;
		}
		setActiveMarker(marker);
	};

	async function calculateRoute() {
		console.log("origin", origin);
		console.log("destination", destination);
		if (origin === {} || destination === {}) {
			return;
		}
		// eslint-disable-next-line no-undef
		const directionsService = new google.maps.DirectionsService();
		const results = await directionsService.route({
			origin: origin,
			destination: destination,
			// eslint-disable-next-line no-undef
			travelMode: google.maps.TravelMode.DRIVING,
		});
		console.log("Results : ", results);
		setDirectionsResponse(results);
		setDistance(results.routes[0].legs[0].distance.text);
		setDuration(results.routes[0].legs[0].duration.text);
	}

	function clearRoute() {
		setDistance("");
		setDuration("");
		setOrigin({
			lat: 46.55309574467675,
			lng: 0.5677825643038148,
		});
		setDestination({
			lat: 46.5785563,
			lng: 0.2630183,
		});
		setDirectionsResponse(null);
	}

	console.log("Directions  : ", directionsResponse);
	console.log("Distance : ", distance);
	console.log("Duration : ", duration);

	return (
		<>
			<div className="reset-btn">
				<button onClick={clearRoute}>Reset</button>
			</div>
			<GoogleMap
				zoom={13}
				center={position0}
				mapContainerClassName="map-container"
				options={{
					zoomControl: true,
					streetViewControl: false,
					mapTypeControl: false,
					fullscreenControl: false,
				}}
				onLoad={(map) => setMap(map)}
			>
				<MarkerF
					key={1}
					position={{ lat: positions[0].lat, lng: positions[0].lng }}
					onClick={() => {
						handleActiveMarker(1);
						// setOrigin({lat: positions[0].lat, lng: positions[0].lng});
						calculateRoute();
					}}
				>
					{activeMarker === 1 ? (
						<InfoWindowF onCloseClick={() => setActiveMarker(null)}>
							<>
								<h3>Ma maison, Pouillé</h3>
								<div>
									Victus universis caro ferina est lactisque abundans copia qua
									sustentantur, et herbae multiplices et siquae alites capi per
									aucupium possint, et plerosque mos vidimus frumenti usum et
									vini penitus ignorantes.
								</div>
							</>
						</InfoWindowF>
					) : null}
				</MarkerF>
				<MarkerF
					key={2}
					position={{ lat: 46.5785563, lng: 0.2630183 }}
					onClick={() => {
						handleActiveMarker(1);
						clearRoute();
						calculateRoute();
					}}
				>
					{activeMarker === 2 ? (
						<InfoWindowF onCloseClick={() => setActiveMarker(null)}>
							<>
								<h3>CREPS, Vouillé</h3>
								<div>
									Victus universis caro ferina est lactisque abundans copia qua
									sustentantur, et herbae multiplices et siquae alites capi per
									aucupium possint, et plerosque mos vidimus frumenti usum et
									vini penitus ignorantes.
								</div>
							</>
						</InfoWindowF>
					) : null}
				</MarkerF>
				{markers.map(({ id, name, description, position }) => (
					<MarkerF
						key={id}
						position={position}
						onClick={() => {
							handleActiveMarker(id);
							clearRoute();
							setOrigin(position);
							calculateRoute();
						}}
					>
						{activeMarker === id ? (
							<InfoWindowF onCloseClick={() => setActiveMarker(null)}>
								<>
									<h3>{name}</h3>
									<div>{description}</div>
								</>
							</InfoWindowF>
						) : null}
					</MarkerF>
				))}
				{directionsResponse && (
					<DirectionsRenderer directions={directionsResponse} />
				)}
			</GoogleMap>
		</>
	);
};

export default App;
