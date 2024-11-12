//@ts-nocheck
import {
  FacebookAccountType,
  MessagingPlatformAccountType,
  Place,
  PlaceType,
  PlaceTypeLabel,
  placeTypes,
} from '@/model'
import {
  defaultIntlText,
  defaultLocale,
  getIntlValue,
  IntlInputFiled,
  SupportedLocale,
  SupportedLocaleLabel,
} from '@/components/custom/intl-input-filed.tsx'
import { AddressEditor } from '@/components/custom/address-editor.tsx'
import { OpenHoursEditor } from '@/components/custom/open-hours-editor.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RepeatableInput } from '@/components/custom/repeatable-input.tsx'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { Calendar } from '@/components/ui/calendar.tsx'
import api, { RequestError } from '@/services/api.ts'
import { addPlace, selectPlace } from '@/data/redux/slices/places.ts'
import { ToastAction } from '@/components/ui/toast.tsx'
import useLocalStorage from '@/hooks/use-local-storage.tsx'
import { useAppDispatch, useAppSelector } from '@/data/redux/hooks.ts'
import { useToast } from '@/components/ui/use-toast.ts'
import { LoadingSpinner } from '@/components/ui/loading-spinner.tsx'
import { useNavigate, useParams } from 'react-router-dom'
import { VerifiedIcon } from 'lucide-react'
import { ImagesEditor } from '@/pages/places/edit.place/_components/images-editor.tsx'

// const defaultPlace = {
//   location: { latitude: 0.0, longitude: 0.0 },
//   type: 'OTHER',
//   customType: undefined,
//   test: false,
//   hidden: false,
//   hiddenUntil: undefined,
//   images: [],
//   names: {
//     official: { [SupportedLocale.EN_US]: '', [SupportedLocale.AM]: '' },
//     special: [],
//   },
//   address: defaultAddress,
//   contact: {
//     phone: { primary: '', alternatives: [] },
//     email: { primary: '', alternatives: [] },
//     socialMedia: {
//       website: '',
//       x: [],
//       instagram: [],
//       telegram: [],
//       whatsapp: [],
//       facebook: [],
//     },
//   },
//   openHours: defaultOpenHours,
// }

const placeEditorFormSchema = z.object({
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  type: z.enum(Object.values(PlaceType)),
  customType: z.optional(z.nullable(z.string())),
  test: z.boolean(),
  hidden: z.boolean(),
  hiddenUntil: z.optional(z.nullable(z.string())),
  images: z.array(z.string()),
  names: z.object({
    official: z.record(z.string(), z.string()),
    special: z.array(z.record(z.string(), z.string())),
  }),
  address: z.object({
    country: z.string(),
    province: z.string(),
    county: z.string(),
    municipality: z.string(),
    borough: z.optional(z.nullable(z.string())),
    district: z.optional(z.nullable(z.string())),
    village: z.optional(z.nullable(z.string())),
    street: z.optional(z.nullable(z.string())),
    block: z.optional(z.nullable(z.string())),
    houseNumber: z.optional(z.nullable(z.string())),
  }),
  contact: z.object({
    phone: z.object({
      primary: z.optional(z.nullable(z.string())),
      alternatives: z.array(z.string()),
    }),
    email: z.object({
      primary: z.optional(z.nullable(z.string())),
      alternatives: z.array(z.string()),
    }),
    socialMedia: z.object({
      website: z.optional(z.nullable(z.string())),
      x: z.array(z.string()),
      instagram: z.array(z.string()),
      telegram: z.array(
        z.object({
          type: z.enum(Object.values(MessagingPlatformAccountType)),
          handle: z.string(),
        })
      ),
      whatsapp: z.array(
        z.object({
          type: z.enum(Object.values(MessagingPlatformAccountType)),
          handle: z.string(),
        })
      ),
      facebook: z.array(
        z.object({
          type: z.enum(Object.values(FacebookAccountType)),
          handle: z.string(),
        })
      ),
    }),
  }),
  openHours: z.optional(
    z.nullable(
      z.object({
        monday: z.object({
          open: z.boolean(),
          shifts: z.array(z.array(z.number())),
        }),
        tuesday: z.object({
          open: z.boolean(),
          shifts: z.array(z.array(z.number())),
        }),
        wednesday: z.object({
          open: z.boolean(),
          shifts: z.array(z.array(z.number())),
        }),
        thursday: z.object({
          open: z.boolean(),
          shifts: z.array(z.array(z.number())),
        }),
        friday: z.object({
          open: z.boolean(),
          shifts: z.array(z.array(z.number())),
        }),
        saturday: z.object({
          open: z.boolean(),
          shifts: z.array(z.array(z.number())),
        }),
        sunday: z.object({
          open: z.boolean(),
          shifts: z.array(z.array(z.number())),
        }),
      })
    )
  ),
})

export default function EditPlace() {
  const { id } = useParams()

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const place = useAppSelector(selectPlace(String(id) ?? ''))

  const { toast } = useToast()

  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  const [addressLocale, setAddressLocale] = useState(defaultLocale)

  const [requesting, setRequesting] = useState(false)

  const form = useForm<z.infer<typeof placeEditorFormSchema>>({
    resolver: zodResolver(placeEditorFormSchema),
    defaultValues: {
      ...place,
      test: place?.test ?? false,
      hidden: place?.hidden ?? false,
      hiddenUntil: place?.hiddenUntil ?? undefined,
    },
  })

  async function fetchPlace() {
    const res = await api.getPlace({
      apiAccessToken: String(apiAccessToken),
      id: String(id),
    })

    const data = await res.json()

    form.setValue('root', data.data)
  }

  useEffect(() => {
    const id = setTimeout(() => {
      fetchPlace()
    }, 1)

    return () => clearTimeout(id)
  }, [])

  async function updatePlace(place: z.infer<typeof placeEditorFormSchema>) {
    try {
      setRequesting(true)

      const response = await api.updatePlace({
        apiAccessToken: String(apiAccessToken),
        place: { ...place, location: undefined },
        id,
      } as any)

      if (response.ok) {
        const result = (await response.json()) as {
          count: number
          atOffset: number
          data: Array<Place>
        }

        console.log(result)

        dispatch(
          addPlace({
            ...place,
            ...place,
          } as any)
        )
      } else {
        const responseData = (await response.json()).error as RequestError

        toast({
          title: `${responseData.namespace}/${responseData.code}`,
          description: responseData.message,
          variant: 'destructive',
        })
      }
    } catch (e) {
      console.error(e)

      toast({
        title: 'Request Failed',
        description: 'Check your network connection!',
        variant: 'destructive',
        action: (
          <ToastAction altText='Try again' onClick={() => updatePlace(place)}>
            Try again
          </ToastAction>
        ),
      })
    } finally {
      setRequesting(false)
    }
  }

  function onSubmit(values: z.infer<typeof placeEditorFormSchema>) {
    try {
      console.log('Submitting', values)
      void updatePlace(values)
    } catch (e) {
      console.log(e)
    }
  }

  const handleApprovePlace = async () => {
    try {
      console.log('here', place)
      const response = await api.approvePlace({
        apiAccessToken: String(apiAccessToken),
        ids: String(id),
      })

      if (response.ok) {
        toast({
          title: 'Succeffully approved place',
          description: 'The place has been approved',
        })
      } else {
        const responseData = (await response.json()).error as RequestError

        toast({
          title: `${responseData.namespace}/${responseData.code}`,
          description: responseData.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Failed to approve place:', error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`relative flex max-h-screen w-full flex-col items-center overflow-y-auto pb-16`}
      >
        <div className='sticky top-0 z-[1000] flex w-full flex-row items-center justify-between border-b bg-background p-3'>
          <Button
            disabled={requesting}
            onClick={() => navigate('/places')}
            type={'button'}
            variant='secondary'
          >
            Go back
          </Button>

          <Label className='font-bold'>Edit place</Label>

          <div className='flex items-center justify-center gap-8'>
            {place?.status != 'APPROVED' ? (
              <Button
                type='button'
                onClick={() => {
                  console.log('hello wo')
                  handleApprovePlace()
                }}
                variant='secondary'
              >
                Approve
              </Button>
            ) : (
              <div className='flex items-center justify-center whitespace-nowrap'>
                <VerifiedIcon size={15} className='mr-2 text-green-700' />
                <span className='text-green-700'>Approved</span>
              </div>
            )}

            <Button disabled={requesting} type='submit'>
              {requesting ? <LoadingSpinner /> : `Update`}
            </Button>
          </div>
        </div>

        <div className='w-full max-w-3xl p-6'>
          <div className='gundefinedap-4 flex w-full flex-col'>
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem className='w-full justify-between rounded-lg border p-4'>
                  <FormLabel>Place type</FormLabel>

                  <FormDescription>The place category</FormDescription>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Type' />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {placeTypes.map((v, i) => (
                        <SelectItem key={i} value={PlaceType[v]}>
                          {PlaceTypeLabel[v]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {form.getValues().type === PlaceType.OTHER && (
              <FormField
                control={form.control}
                name='customType'
                render={({ field }) => (
                  <FormItem className='w-full justify-between rounded-lg border p-4'>
                    <FormLabel>Custom place type</FormLabel>

                    <FormDescription>
                      Specific place type to identify "Other" place category
                      better.
                    </FormDescription>

                    <FormControl className={'flex-1'}>
                      <Input
                        placeholder='Backery'
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name='test'
              render={({ field }) => (
                <FormItem className='flex w-full flex-row items-center justify-between gap-4 rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel>Test</FormLabel>

                    <FormDescription>
                      The entry is a test entry.
                    </FormDescription>
                  </div>

                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='hidden'
              render={({ field }) => (
                <FormItem className='flex w-full flex-row items-center justify-between gap-4 rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel>Hidden</FormLabel>

                    <FormDescription>
                      The entry is not exposed to the consumer API.
                    </FormDescription>
                  </div>

                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        if (!checked)
                          //@ts-ignore
                          form.setValue('hiddenUntil', undefined, {
                            shouldTouch: true,
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {form.getValues().hidden && (
              <FormField
                control={form.control}
                name='hiddenUntil'
                render={({ field }) => (
                  <FormItem className='flex w-full flex-row flex-wrap justify-between gap-4 rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel>Hidden until</FormLabel>

                      <FormDescription>
                        Date after which it will be exposed to the consumer API.
                      </FormDescription>
                    </div>

                    <FormControl>
                      <Calendar
                        mode='single'
                        selected={
                          new Date(
                            !Number.isNaN(Date.parse(field.value))
                              ? Date.parse(field.value)
                              : 0
                          )
                        }
                        onSelect={(date) => field.onChange(date.toISOString())}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className='flex w-full flex-col gap-2 rounded-lg border p-4'>
              <Label className='text-muted-foreground'>Names</Label>

              <FormField
                control={form.control}
                name='names.official'
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <FormLabel>Official name</FormLabel>

                    <FormControl>
                      <IntlInputFiled
                        placeHolder={{
                          [SupportedLocale.EN_US]: 'Official name',
                          [SupportedLocale.AM]: 'ዋና ስም',
                        }}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='my-2 w-full border-t' />

              <FormField
                control={form.control}
                name='names.special'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RepeatableInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        defaultEntry={defaultIntlText}
                        header={'Special names'}
                        placeHolderExtractor={(i) => ({
                          [SupportedLocale.EN_US]: 'Special name',
                          [SupportedLocale.AM]: 'ልዩ ስም',
                        })}
                        renderField={(placeHolder, value, onChange) => (
                          <IntlInputFiled
                            placeHolder={placeHolder}
                            value={value}
                            onChange={onChange}
                          />
                        )}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* fayas_phone: +251 97 339 5179 */}
            </div>

            <div className='flex w-full flex-col gap-2 rounded-lg border p-4'>
              <div className='flex w-full flex-row items-center justify-between gap-4'>
                <Label className='flex-1 text-muted-foreground'>Address</Label>

                <Select
                  onValueChange={(v) => setAddressLocale(v)}
                  defaultValue={addressLocale}
                >
                  <SelectTrigger className={'w-[5rem]'}>
                    <SelectValue placeholder='Locale' />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={SupportedLocale.EN_US}>
                      {SupportedLocaleLabel[SupportedLocale.EN_US].nativeLabel}
                    </SelectItem>
                    <SelectItem value={SupportedLocale.AM}>
                      {SupportedLocaleLabel[SupportedLocale.AM].nativeLabel}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <FormField
                control={form.control}
                name={'address'}
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <FormControl>
                      <AddressEditor
                        locale={addressLocale}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex w-full flex-col gap-2 rounded-lg border p-4'>
              <Label className='text-muted-foreground'>Contact</Label>

              <FormField
                control={form.control}
                name='contact.phone.primary'
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <FormLabel>Primary Phone Number</FormLabel>

                    <FormControl className={'flex-1'}>
                      <Input
                        placeholder='+251 XX XXX XXX'
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='contact.phone.alternatives'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RepeatableInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        defaultEntry={''}
                        header={'Alternative phone numbers'}
                        placeHolderExtractor={(i) => ({
                          [SupportedLocale.EN_US]: '+251 XX XXX XXX',
                        })}
                        renderField={(placeHolder, value, onChange) => (
                          <Input
                            placeholder={getIntlValue(
                              placeHolder,
                              defaultLocale
                            )}
                            value={value ?? undefined}
                            onChange={(e) => onChange(e.target.value)}
                          />
                        )}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='my-2 w-full border-t' />

              <FormField
                control={form.control}
                name='contact.email.primary'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Email</FormLabel>

                    <FormControl className={'flex-1'}>
                      <Input
                        placeholder='someemail@somedomain.sometld'
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='contact.email.alternatives'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RepeatableInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        defaultEntry={''}
                        header={'Alternative email numbers'}
                        placeHolderExtractor={(i) => ({
                          [SupportedLocale.EN_US]:
                            'someemail@somedomain.sometld',
                        })}
                        renderField={(placeHolder, value, onChange) => (
                          <Input
                            placeholder={getIntlValue(
                              placeHolder,
                              defaultLocale
                            )}
                            value={value ?? undefined}
                            onChange={(e) => onChange(e.target.value)}
                          />
                        )}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='my-2 w-full border-t' />

              <FormField
                control={form.control}
                name='contact.socialMedia.website'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>

                    <FormControl className={'flex-1'}>
                      <Input
                        placeholder='https://www.somedomain.tld'
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='my-2 w-full border-t' />

              <FormField
                control={form.control}
                name='contact.socialMedia.x'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RepeatableInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        defaultEntry={''}
                        header={'X'}
                        placeHolderExtractor={(i) => ({
                          [SupportedLocale.EN_US]: 'handle',
                        })}
                        renderField={(placeHolder, value, onChange) => (
                          <Input
                            placeholder={getIntlValue(
                              placeHolder,
                              defaultLocale
                            )}
                            value={value ?? undefined}
                            onChange={(e) => onChange(e.target.value)}
                          />
                        )}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='my-2 w-full border-t' />

              <FormField
                control={form.control}
                name='contact.socialMedia.instagram'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RepeatableInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        defaultEntry={''}
                        header={'Instagram'}
                        placeHolderExtractor={(i) => ({
                          [SupportedLocale.EN_US]: 'handle',
                        })}
                        renderField={(placeHolder, value, onChange) => (
                          <Input
                            placeholder={getIntlValue(
                              placeHolder,
                              defaultLocale
                            )}
                            value={value ?? undefined}
                            onChange={(e) => onChange(e.target.value)}
                          />
                        )}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='my-2 w-full border-t' />

              <FormField
                control={form.control}
                name='contact.socialMedia.telegram'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RepeatableInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        defaultEntry={{ type: 'PERSONAL', handle: '' }}
                        header={'Telegram'}
                        placeHolderExtractor={(i) => ({
                          [SupportedLocale.EN_US]: 'handle',
                        })}
                        renderField={(placeHolder, value, onChange) => (
                          <div className='flex w-full flex-col gap-1'>
                            <Select
                              onValueChange={(v) =>
                                onChange({ ...value, type: v })
                              }
                              defaultValue={value.type}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Type' />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectItem value={'GROUP'}>Group</SelectItem>
                                <SelectItem value={'CHANNEL'}>
                                  Channel
                                </SelectItem>
                                <SelectItem value={'BOT'}>Bot</SelectItem>
                                <SelectItem value={'PERSONAL'}>
                                  Personal
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <Input
                              placeholder={getIntlValue(
                                placeHolder,
                                defaultLocale
                              )}
                              value={value.handle ?? undefined}
                              onChange={(e) =>
                                onChange({
                                  ...value,
                                  handle: e.target.value,
                                })
                              }
                            />
                          </div>
                        )}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='my-2 w-full border-t' />

              <FormField
                control={form.control}
                name='contact.socialMedia.whatsapp'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RepeatableInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        defaultEntry={{ type: 'PERSONAL', handle: '' }}
                        header={'Whatsapp'}
                        placeHolderExtractor={(i) => ({
                          [SupportedLocale.EN_US]: 'handle',
                        })}
                        renderField={(placeHolder, value, onChange) => (
                          <div className='flex w-full flex-col gap-1'>
                            <Select
                              onValueChange={(v) =>
                                onChange({ ...value, type: v })
                              }
                              defaultValue={value.type}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Type' />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectItem value={'GROUP'}>Group</SelectItem>
                                <SelectItem value={'CHANNEL'}>
                                  Channel
                                </SelectItem>
                                <SelectItem value={'BOT'}>Bot</SelectItem>
                                <SelectItem value={'PERSONAL'}>
                                  Personal
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <Input
                              placeholder={getIntlValue(
                                placeHolder,
                                defaultLocale
                              )}
                              value={value.handle ?? undefined}
                              onChange={(e) =>
                                onChange({
                                  ...value,
                                  handle: e.target.value,
                                })
                              }
                            />
                          </div>
                        )}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='my-2 w-full border-t' />

              <FormField
                control={form.control}
                name='contact.socialMedia.facebook'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RepeatableInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        defaultEntry={{ type: 'PAGE', handle: '' }}
                        header={'Facebook'}
                        placeHolderExtractor={(i) => ({
                          [SupportedLocale.EN_US]: 'handle',
                        })}
                        renderField={(placeHolder, value, onChange) => (
                          <div className='flex w-full flex-col gap-1'>
                            <Select
                              onValueChange={(v) =>
                                onChange({ ...value, type: v })
                              }
                              defaultValue={value.type}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Type' />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectItem value={'FACEBOOK_GROUP'}>
                                  Group
                                </SelectItem>
                                <SelectItem value={'PAGE'}>Page</SelectItem>
                              </SelectContent>
                            </Select>

                            <Input
                              placeholder={getIntlValue(
                                placeHolder,
                                defaultLocale
                              )}
                              value={value.handle ?? undefined}
                              onChange={(e) =>
                                onChange({
                                  ...value,
                                  handle: e.target.value,
                                })
                              }
                            />
                          </div>
                        )}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex w-full flex-col gap-2 rounded-lg border p-4'>
              <Label className='text-muted-foreground'>Open hours</Label>

              <FormField
                control={form.control}
                name={'openHours'}
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <FormControl>
                      <OpenHoursEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex w-full flex-col gap-2 rounded-lg border p-4'>
              <Label className='text-muted-foreground'>Images</Label>

              <FormField
                control={form.control}
                name={'images'}
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <FormControl>
                      <ImagesEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
