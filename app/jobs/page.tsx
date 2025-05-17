"use client";
import React, { useState, Fragment } from "react";
import JobCards from "./JobCards";
import {
  Dialog,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  XMarkIcon,
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";

const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];
const subCategories = [
  { name: "Totes", href: "#" },
  { name: "Backpacks", href: "#" },
  { name: "Travel Bags", href: "#" },
  { name: "Hip Bags", href: "#" },
  { name: "Laptop Sleeves", href: "#" },
];
const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White", checked: false },
      { value: "beige", label: "Beige", checked: false },
      { value: "blue", label: "Blue", checked: true },
      { value: "brown", label: "Brown", checked: false },
      { value: "green", label: "Green", checked: false },
      { value: "purple", label: "Purple", checked: false },
    ],
  },
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "New Arrivals", checked: false },
      { value: "sale", label: "Sale", checked: false },
      { value: "travel", label: "Travel", checked: true },
      { value: "organization", label: "Organization", checked: false },
      { value: "accessories", label: "Accessories", checked: false },
    ],
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "2l", label: "2L", checked: false },
      { value: "6l", label: "6L", checked: false },
      { value: "12l", label: "12L", checked: false },
      { value: "18l", label: "18L", checked: false },
      { value: "20l", label: "20L", checked: false },
      { value: "40l", label: "40L", checked: true },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const JobsPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Mobile Filter Dialog */}
      <Transition show={mobileFiltersOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setMobileFiltersOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto h-full w-full max-w-xs bg-gray-800 py-4 pb-12 shadow-xl overflow-y-auto">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-white">Filters</h2>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4 border-t border-gray-700">
                  {filters.map((section) => (
                    <Disclosure
                      key={section.id}
                      as="div"
                      className="border-b border-gray-700 px-4 py-6"
                    >
                      <DisclosureButton className="flex w-full justify-between text-sm font-medium text-gray-300 hover:text-white">
                        <span>{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon className="h-5 w-5" />
                        </span>
                      </DisclosureButton>
                      <DisclosurePanel className="mt-4 space-y-4">
                        {section.options.map((option, idx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              id={`filter-${section.id}-${idx}`}
                              name={`${section.id}[]`}
                              defaultChecked={option.checked}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-400"
                            />
                            <label
                              htmlFor={`filter-${section.id}-${idx}`}
                              className="ml-3 text-sm text-gray-300"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </DisclosurePanel>
                    </Disclosure>
                  ))}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Main Content */}
      <main className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-baseline justify-between border-b border-gray-700 pt-24 pb-6">
          <h1 className="text-4xl font-bold tracking-tight">Jobs</h1>

          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-300 hover:text-white">
                Sort
                <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-gray-800 shadow-2xl ring-1 ring-black/50 focus:outline-none">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.name}>
                      {({ active }) => (
                        <a
                          href={option.href}
                          className={classNames(
                            option.current
                              ? "font-medium text-white"
                              : "text-gray-300",
                            active ? "bg-gray-700" : "",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          {option.name}
                        </a>
                      )}
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>

            <button
              type="button"
              className="ml-4 text-gray-400 hover:text-white"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="ml-4 text-gray-400 hover:text-white lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters + Cards Grid */}
        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
            {/* Desktop Filters */}
            <form className="hidden lg:block lg:col-span-1">
              <ul className="space-y-4 border-b border-gray-700 pb-6 text-sm font-medium text-white">
                {subCategories.map((category) => (
                  <li key={category.name}>
                    <a href={category.href} className="hover:text-gray-300">
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>

              {filters.map((section) => (
                <Disclosure
                  key={section.id}
                  as="div"
                  className="border-b border-gray-700 py-6"
                >
                  <DisclosureButton className="flex w-full justify-between text-sm font-medium text-gray-300 hover:text-white">
                    <span>{section.name}</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon className="h-5 w-5 group-data-open:hidden" />
                      <MinusIcon className="h-5 w-5 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                  <DisclosurePanel className="pt-6 space-y-4">
                    {section.options.map((option, idx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`filter-${section.id}-${idx}`}
                          name={`${section.id}[]`}
                          defaultChecked={option.checked}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-400"
                        />
                        <label
                          htmlFor={`filter-${section.id}-${idx}`}
                          className="ml-3 text-sm text-gray-300"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
              ))}
            </form>
            {/* Job Cards */}

            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-9 gap-4">
              <JobCards />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default JobsPage;
