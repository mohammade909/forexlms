import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'



const Faq = ({data}) => {

  return (
   <>
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className=" max-w-7xl divide-y divide-gray-900/10">
        <div className=" text-center">
            <h1 className="bg-white px-3 text-4xl pb-3 font-bold text-gray-900">
           {data?.[4].title}
            </h1>
            <p className='mt-2'>{data?.[4].sub_title}</p>
          </div>
          
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {data?.[4]?.faqs.map((faq) => (
              <Disclosure key={faq.heading} as="div" className="pt-6">
                <dt>
                  <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                    <span className="text-base font-semibold leading-7">{faq.heading}</span>
                    <span className="ml-6 flex h-7 items-center">
                      <PlusSmallIcon aria-hidden="true" className="h-6 w-6 group-data-[open]:hidden" />
                      <MinusSmallIcon aria-hidden="true" className="h-6 w-6 [.group:not([data-open])_&]:hidden" />
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="mt-2 pr-12">
                  <p className="text-base leading-7 text-gray-600">{faq.sub_heading}</p>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
   </>
  )
}

export default Faq
