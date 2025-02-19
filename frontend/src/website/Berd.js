import { HomeIcon } from '@heroicons/react/20/solid'
import { useLocation, Link } from 'react-router-dom'

const Bread = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav aria-label="Breadcrumb" className="flex relative isolate overflow-hidden py-24 sm:py-32">
      <img
        alt=""
        src="/bg2.jpg"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-15"
      />
      <ol role="list" className="flex space-x-4 rounded-md bg-white px-6 shadow mx-auto">
        <li className="flex">
          <div className="flex items-center">
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <HomeIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={to} className="flex">
              <div className="flex items-center">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 44"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="h-full w-6 flex-shrink-0 text-gray-200"
                >
                  <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>
                <Link
                  to={to}
                  aria-current={isLast ? 'page' : undefined}
                  className={`ml-4 text-sm font-medium ${isLast ? 'text-gray-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Bread;
