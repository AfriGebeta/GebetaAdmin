import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { RecentSales } from './components/recent-sales'
import { Overview } from './components/overview'
import UsagePie from './components/usage-pie'
import UsersPie from './components/users-pie'
import UsageGraph from './components/usage-graph'
import { useEffect, useMemo, useState } from 'react'
import useLocalStorage from '@/hooks/use-local-storage'
import { getFeatureAccessToken } from '@/utils/token-feat'
import api from '@/services/api'

export default function Dashboard() {
  const [apiAccessToken] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })
  const [currentProfile] = useLocalStorage({
    key: 'currentProfile',
    defaultValue: null,
  })
  const featureAccessToken = useMemo(
    () => getFeatureAccessToken(currentProfile),
    [currentProfile]
  )

  const [totalUsers, setTotalUsers] = useState<number | null>(null)
  const [creditUsers, setCreditUsers] = useState<number | null>(null)
  const [totalPlaces, setTotalPlaces] = useState<number | null>(null)
  const [analyticsRange, setAnalyticsRange] = useState('last-month')

  useEffect(() => {
    const load = async () => {
      try {
        const usersRes = await api.getUsers({
          apiAccessToken: String(apiAccessToken),
          page: 1,
          limit: 1,
        })
        if (usersRes.ok) {
          const j = await usersRes.json()
          setTotalUsers(j?.data?.count ?? null)
        }

        const placesRes = await api.getPlaces({
          apiAccessToken: String(apiAccessToken),
          page: 1,
          limit: 1,
        })
        if (placesRes.ok) {
          const pj = await placesRes.json()
          setTotalPlaces(pj?.data?.count ?? null)
        }

        const creditUsersRes = await api.getUsers({
          apiAccessToken: String(apiAccessToken),
          page: 1,
          limit: 1,
          creditUser: true,
        })
        if (creditUsersRes.ok) {
          const cj = await creditUsersRes.json()
          setCreditUsers(cj?.data?.count ?? null)
        }
      } catch (e) {}
    }
    load()
  }, [apiAccessToken, featureAccessToken])
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        {/*<TopNav links={topNav} />*/}
        <div className='ml-auto flex items-center space-x-4'>
          {/*<Search />*/}
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      {/* ===== Main ===== */}
      <LayoutBody className='space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Dashboard
          </h1>
          {/* <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div> */}
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='overflow-x-none w-full pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              {/* <TabsTrigger value='reports'>Reports</TabsTrigger>
              <TabsTrigger value='notifications'>Notifications</TabsTrigger> */}
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Sales
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>$45,231.89</div>
                  {/* <p className='text-xs text-muted-foreground'>
                    +20.1% from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Users
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {totalUsers ?? '...'}
                  </div>
                  {/* <p className='text-xs text-muted-foreground'>
                    +180.1% from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Credit Users
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {creditUsers ?? '...'}
                  </div>
                  {/* <p className='text-xs text-muted-foreground'>
                    +19% from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Places
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {totalPlaces ?? '...'}
                  </div>
                  {/* <p className='text-xs text-muted-foreground'>
                    +201 since last month
                  </p> */}
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium'>Analytics</h3>
              <Select value={analyticsRange} onValueChange={setAnalyticsRange}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select time range' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='last-week'>Last Week</SelectItem>
                  <SelectItem value='last-month'>Last Month</SelectItem>
                  <SelectItem value='last-3-months'>Last 3 Months</SelectItem>
                  <SelectItem value='last-6-months'>Last 6 Months</SelectItem>
                  <SelectItem value='last-year'>Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-2'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Usage Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UsagePie range={analyticsRange} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Users Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UsersPie />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium'>
                  Total Usage Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UsageGraph range={analyticsRange} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  )
}

// const topNav = [
//   {
//     title: 'Overview',
//     href: 'dashboard/overview',
//     isActive: true,
//   },
//   {
//     title: 'Customers',
//     href: 'dashboard/customers',
//     isActive: false,
//   },
//   {
//     title: 'Products',
//     href: 'dashboard/products',
//     isActive: false,
//   },
//   {
//     title: 'Settings',
//     href: 'dashboard/settings',
//     isActive: false,
//   },
// ]
