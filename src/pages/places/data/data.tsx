import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons'
import { PlaceStatus, PlaceType } from '@/contexts'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: PlaceStatus.APPROVED,
    label: 'Approved',
    icon: CheckCircledIcon,
  },
  {
    value: PlaceStatus.CHANGE_REQUESTED,
    label: 'Change Requested',
    icon: QuestionMarkCircledIcon,
  },
  {
    value: PlaceStatus.PENDING,
    label: 'Pending',
    icon: StopwatchIcon,
  },
]

export const types = [
  {
    value: PlaceType.OTHER,
    label: 'Other',
  },
  {
    value: PlaceType.CLINIC,
    label: 'Clinic',
  },
  {
    value: PlaceType.DWELLING,
    label: 'Dwelling',
  },
  {
    value: PlaceType.HOSPITAL,
    label: 'Hospital',
  },
  {
    value: PlaceType.OFFICE,
    label: 'Office',
  },
  {
    value: PlaceType.PARK,
    label: 'Park',
  },
  {
    value: PlaceType.PHARMACY,
    label: 'Pharmacy',
  },
  {
    value: PlaceType.TRANSPORTATION_STATION,
    label: 'Transportation Station',
  },
  {
    value: PlaceType.RESTAURANT,
    label: 'Restaurant',
  },
  {
    value: PlaceType.SCHOOL,
    label: 'School',
  },
  {
    value: PlaceType.SUPERMARKET,
    label: 'Supermarket',
  },
  {
    value: PlaceType.BANK,
    label: 'Bank',
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: ArrowDownIcon,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: ArrowRightIcon,
  },
  {
    label: 'High',
    value: 'high',
    icon: ArrowUpIcon,
  },
]
