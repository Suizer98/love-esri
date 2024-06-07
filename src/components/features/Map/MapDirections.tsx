import { Button, Heading } from '@chakra-ui/react'

interface RouteStep {
  attributes: {
    text: string
  }
}

interface MapDirectionsProps {
  routeSteps: RouteStep[]
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean) => void
}

const MapDirections: React.FC<MapDirectionsProps> = ({ routeSteps, isExpanded, setIsExpanded }) => {
  return (
    <div
      title="Route Directions"
      className="esri-widget"
      style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        width: '250px',
        maxHeight: isExpanded ? '40%' : '50px',
        overflowY: isExpanded ? 'auto' : 'hidden',
        zIndex: 10,
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        transition: 'max-height 0.3s ease-in-out'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Heading as="h4" size="md" mb={0}>
          Directions
        </Heading>
        <Button size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      {isExpanded && (
        <div style={{ listStyleType: 'none', padding: '10px 0 0 0' }}>
          {routeSteps.map((step, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              {`${index + 1}. ${step.attributes.text}`}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MapDirections
