export default {
  subscribeToPlaces() {
    return new EventSource(`${import.meta.env['VITE_API_BASE_URL']}/places/sse`)
  },
  subscribeToTransportationRoutes() {
    return new EventSource(
      `${import.meta.env['VITE_API_BASE_URL']}/transportation-routes/sse`
    )
  },
}
