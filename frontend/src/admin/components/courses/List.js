import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { getCourses } from "../../actions/course";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
const statuses = {
  published: "text-green-700 bg-green-50 ring-green-600/20",
  archived: "text-gray-600 bg-gray-50 ring-gray-500/10",
  draft: "text-red-700 bg-red-50 ring-red-600/10",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ListCourses() {
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.courses);
  const { auth } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getCourses());
  }, []);



  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8 bg-white p-3"
    >
      {courses?.map((course) => (
        <li
          key={course.course_id}
          className="overflow-hidden rounded-xl border border-gray-200"
        >
          <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-700 p-6">
            <img
              src={`/courses/${course.course_image}`}
              alt={course.course_name}
              className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
            />
            <div className="text-sm font-medium leading-6 text-white tracking-wider">
              {course.course_name}
            </div>
            <Menu as="div" className="relative ml-auto">
              <MenuButton className="-m-2.5 block p-2.5 text-white hover:text-gray-500">
                <span className="sr-only">Open options</span>
                <EllipsisHorizontalIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      to={
                        auth
                          ? `/admin/courses/view/${course.course_id}`
                          : `/courses/view/${course.course_id}`
                      }
                      className={classNames(
                        focus ? "bg-gray-50" : "",
                        "block px-3 py-1 text-sm leading-6 text-gray-900"
                      )}
                    >
                      View<span className="sr-only">, {course.name}</span>
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <Link
                     to={
                        auth
                          ? `/courses/edit/${course.course_id}`
                          : `#`
                      }
                      className={classNames(
                        focus ? "bg-gray-50" : "",
                        "block px-3 py-1 text-sm leading-6 text-gray-900"
                      )}
                    >
                      Edit<span className="sr-only">, {course.name}</span>
                    </Link>
                  )}
                </MenuItem>
             
              </MenuItems>
            </Menu>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Duration:</dt>
              <dd className="text-gray-700">
                <time dateTime={course.course_duration}>
                  {course.course_duration}
                </time>
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Price</dt>
              <dd className="flex items-start gap-x-2">
                <div className="font-medium text-gray-900">
                  {course.course_price}
                </div>
                <div
                  className={classNames(
                    statuses[course.course_status],
                    "rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                  )}
                >
                  {course.course_status}
                </div>
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
