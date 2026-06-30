"use client";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";
import { NavigationMenu } from "radix-ui";
import Link from "next/link";
import "./navigation-bar.css";


export function WalkthoughNavigationBar() {
  return (
    <>
      <div className="subsection mt-32">
        <div className="font-bold text-2xl">
          <div>
            <h2>Build a Navigation Bar</h2>
          </div>
        </div>
        <div className="mt-16 h-[500px] border border-dashed pt-16 rounded-3xl bg-white">
          <Orchestration />
        </div>
      </div>
    </>
  )
}


export default function Orchestration() {
  return (
    <NavigationMenu.Root className="root">
      <NavigationMenu.List className="menu-list">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="trigger">
            Interviews
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="content">
            <ul className="list one">
              <li style={{ gridRow: "span 3" }}>
                <NavigationMenu.Link asChild>
                  <Link className="callout" href="/">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 400 400"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="logo"
                    >
                      <g clipPath="url(#clip0_2453_12901)">
                        <path
                          d="M400 67.2214C399.995 49.482 392.946 32.4706 380.402 19.9269C367.859 7.38321 350.847 0.334041 333.108 0.329055C300.663 -9.31323e-05 273.861 23.1814 267.212 53.6417H265.557C262.472 38.5604 254.283 25.0035 242.369 15.2553C230.456 5.50702 215.546 0.163361 200.153 0.124706C184.759 0.0860515 169.823 5.35476 157.861 15.0431C145.898 24.7314 137.641 38.247 134.481 53.3125H132.826C130.364 41.4247 124.722 30.4276 116.503 21.4935C108.283 12.5593 97.7934 6.02281 86.1515 2.58075C74.5096 -0.861307 62.1519 -1.07995 50.3955 1.94812C38.6392 4.97619 27.9247 11.1375 19.3942 19.7753C10.8637 28.4131 4.83689 39.2038 1.95605 50.9971C-0.924786 62.7904 -0.551646 75.1444 3.0357 86.7423C6.62305 98.3403 13.2902 108.747 22.3264 116.855C31.3627 124.962 42.4294 130.465 54.3471 132.778V134.104C39.0594 137.086 25.284 145.29 15.3803 157.311C5.4766 169.333 0.0609582 184.424 0.0609582 200C0.0609582 215.576 5.4766 230.667 15.3803 242.688C25.284 254.71 39.0594 262.914 54.3471 265.895V267.212C42.4173 269.479 31.328 274.946 22.2654 283.028C13.2027 291.111 6.50753 301.505 2.89594 313.098C-0.71565 324.692 -1.1078 337.049 1.76143 348.849C4.63066 360.648 10.6533 371.446 19.1853 380.087C27.7173 388.727 38.4376 394.886 50.1997 397.905C61.9618 400.923 74.3231 400.688 85.9617 397.224C97.6003 393.759 108.078 387.196 116.275 378.237C124.472 369.277 130.079 358.258 132.496 346.358H134.152C140.443 376.818 167.593 399.962 199.718 399.962C215.171 400.033 230.166 394.722 242.129 384.94C254.091 375.159 262.275 361.517 265.275 346.358H266.93C273.221 376.818 300.371 399.962 332.496 399.962C349.146 399.923 365.184 393.687 377.487 382.469C389.789 371.25 397.475 355.853 399.045 339.278C400.616 322.703 395.959 306.137 385.983 292.807C376.007 279.478 361.425 270.34 345.079 267.174V265.858C360.367 262.876 374.142 254.672 384.046 242.651C393.95 230.629 399.365 215.538 399.365 199.962C399.365 184.387 393.95 169.295 384.046 157.274C374.142 145.252 360.367 137.048 345.079 134.067V132.741C360.479 130.026 374.428 121.968 384.473 109.984C394.518 98.0004 400.016 82.8584 400 67.2214ZM307.613 292.049C307.616 294.094 307.216 296.119 306.436 298.009C305.655 299.899 304.508 301.616 303.062 303.062C301.616 304.508 299.899 305.655 298.009 306.435C296.119 307.216 294.094 307.616 292.049 307.613H108.28C106.235 307.616 104.21 307.216 102.32 306.435C100.43 305.655 98.7127 304.508 97.2667 303.062C95.8207 301.616 94.6744 299.899 93.8936 298.009C93.1127 296.119 92.7127 294.094 92.7164 292.049V108.28C92.7127 106.235 93.1127 104.21 93.8936 102.32C94.6744 100.43 95.8207 98.7126 97.2667 97.2666C98.7127 95.8206 100.43 94.6743 102.32 93.8935C104.21 93.1126 106.235 92.7126 108.28 92.7163H292.049C294.094 92.7126 296.119 93.1126 298.009 93.8935C299.899 94.6743 301.616 95.8206 303.062 97.2666C304.508 98.7126 305.655 100.43 306.436 102.32C307.216 104.21 307.616 106.235 307.613 108.28V292.049Z"
                          fill="#ffffff"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2453_12901">
                          <rect width="400" height="400" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <div className="callout-heading">Lochie Axon</div>
                    <p className="callout-text">
                      Lochie is a design engineer at Family.
                    </p>
                  </Link>
                </NavigationMenu.Link>
              </li>

              <ListItem href="/" title="Mariana Castilho">
                Product designer at poolside, previously Vercel.
              </ListItem>
              <ListItem href="/" title="Henry Heffernan">
                A design engineer at Vercel working on v0.
              </ListItem>
              <ListItem href="/" title="Dennis Brotzky">
                Co-founder of Fey, engineer who loves design.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="trigger">
            Lessons
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="content">
            <ul className="list two">
              <ListItem title="Theory" href="/">
                Consists of 4 modules, 24 lessons and 50+ exercises.
              </ListItem>
              <ListItem title="Interviews" href="/">
                Interviews with experts from companies like Vercel.
              </ListItem>
              <ListItem title="Discord" href="/">
                Join an exclusive community on all things animation.
              </ListItem>
              <ListItem title="Walkthroughs" href="/">
                Consists of 3 walkthroughs of high-quality components.
              </ListItem>
              <ListItem title="Vault" href="/">
                A highly curated list of animation resources.
              </ListItem>
              <ListItem title="Certificate" href="/">
                Get your certificate of completion after finishing 70% of the
                course.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link className="link" href="/">
            Account
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <div className="viewport-position">
        <NavigationMenu.Viewport className="viewport" />
      </div>
    </NavigationMenu.Root>
  );
}

function ListItem(
  { className, children, title, ...props }:
    {
      className?: string;
      children?: React.ReactNode;
      title?: string;
    } & ComponentPropsWithoutRef<typeof NavigationMenu.Link>) {
  return (
    <li className={className}>
      <NavigationMenu.Link asChild>
        <a className="list-item-link" {...props}>
          <div className="list-item-heading">{title}</div>
          <p className="list-item-text">{children}</p>
        </a>
      </NavigationMenu.Link>
    </li>
  );
}

// function NavigationBar() {
//   const TriggerStyle = "px-3 py-1 hover:bg-muted rounded-sm font-medium cursor-pointer"
//   return (
//     <NavigationMenu.Root
//       className="relative w-full flex justify-center"
//     >
//       <NavigationMenu.List
//         className="flex items-center gap-2"
//       >
//         <NavigationMenu.Item
//           className="list-none"
//         >
//           <NavigationMenu.Trigger
//             className={TriggerStyle}
//           >Interviews</NavigationMenu.Trigger>
//           <NavigationMenu.Content
//             className="menu-content"
//           >
//             <ul className="grid grid-cols-[0.75fr_1fr] gap-y-2.5 gap-x-2 p-5.5 w-[500px]">
//               <NavigationMenu.Link asChild>
//                 <li className="row-span-3 list-none">
//                   <Link
//                     className="h-full rounded-md bg-linear-to-br from-yellow-200 to-yellow-500 flex flex-col justify-end items-start p-6"
//                     href="/"
//                   >
//                     <svg
//                       width="24"
//                       height="24"
//                       viewBox="0 0 400 400"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="text-white/60"
//                     >
//                       <g clipPath="url(#clip0_2453_12901)">
//                         <path
//                           d="M400 67.2214C399.995 49.482 392.946 32.4706 380.402 19.9269C367.859 7.38321 350.847 0.334041 333.108 0.329055C300.663 -9.31323e-05 273.861 23.1814 267.212 53.6417H265.557C262.472 38.5604 254.283 25.0035 242.369 15.2553C230.456 5.50702 215.546 0.163361 200.153 0.124706C184.759 0.0860515 169.823 5.35476 157.861 15.0431C145.898 24.7314 137.641 38.247 134.481 53.3125H132.826C130.364 41.4247 124.722 30.4276 116.503 21.4935C108.283 12.5593 97.7934 6.02281 86.1515 2.58075C74.5096 -0.861307 62.1519 -1.07995 50.3955 1.94812C38.6392 4.97619 27.9247 11.1375 19.3942 19.7753C10.8637 28.4131 4.83689 39.2038 1.95605 50.9971C-0.924786 62.7904 -0.551646 75.1444 3.0357 86.7423C6.62305 98.3403 13.2902 108.747 22.3264 116.855C31.3627 124.962 42.4294 130.465 54.3471 132.778V134.104C39.0594 137.086 25.284 145.29 15.3803 157.311C5.4766 169.333 0.0609582 184.424 0.0609582 200C0.0609582 215.576 5.4766 230.667 15.3803 242.688C25.284 254.71 39.0594 262.914 54.3471 265.895V267.212C42.4173 269.479 31.328 274.946 22.2654 283.028C13.2027 291.111 6.50753 301.505 2.89594 313.098C-0.71565 324.692 -1.1078 337.049 1.76143 348.849C4.63066 360.648 10.6533 371.446 19.1853 380.087C27.7173 388.727 38.4376 394.886 50.1997 397.905C61.9618 400.923 74.3231 400.688 85.9617 397.224C97.6003 393.759 108.078 387.196 116.275 378.237C124.472 369.277 130.079 358.258 132.496 346.358H134.152C140.443 376.818 167.593 399.962 199.718 399.962C215.171 400.033 230.166 394.722 242.129 384.94C254.091 375.159 262.275 361.517 265.275 346.358H266.93C273.221 376.818 300.371 399.962 332.496 399.962C349.146 399.923 365.184 393.687 377.487 382.469C389.789 371.25 397.475 355.853 399.045 339.278C400.616 322.703 395.959 306.137 385.983 292.807C376.007 279.478 361.425 270.34 345.079 267.174V265.858C360.367 262.876 374.142 254.672 384.046 242.651C393.95 230.629 399.365 215.538 399.365 199.962C399.365 184.387 393.95 169.295 384.046 157.274C374.142 145.252 360.367 137.048 345.079 134.067V132.741C360.479 130.026 374.428 121.968 384.473 109.984C394.518 98.0004 400.016 82.8584 400 67.2214ZM307.613 292.049C307.616 294.094 307.216 296.119 306.436 298.009C305.655 299.899 304.508 301.616 303.062 303.062C301.616 304.508 299.899 305.655 298.009 306.435C296.119 307.216 294.094 307.616 292.049 307.613H108.28C106.235 307.616 104.21 307.216 102.32 306.435C100.43 305.655 98.7127 304.508 97.2667 303.062C95.8207 301.616 94.6744 299.899 93.8936 298.009C93.1127 296.119 92.7127 294.094 92.7164 292.049V108.28C92.7127 106.235 93.1127 104.21 93.8936 102.32C94.6744 100.43 95.8207 98.7126 97.2667 97.2666C98.7127 95.8206 100.43 94.6743 102.32 93.8935C104.21 93.1126 106.235 92.7126 108.28 92.7163H292.049C294.094 92.7126 296.119 93.1126 298.009 93.8935C299.899 94.6743 301.616 95.8206 303.062 97.2666C304.508 98.7126 305.655 100.43 306.436 102.32C307.216 104.21 307.616 106.235 307.613 108.28V292.049Z"
//                           fill="#ffffff"
//                         />
//                       </g>
//                       <defs>
//                         <clipPath id="clip0_2453_12901">
//                           <rect width="400" height="400" fill="white" />
//                         </clipPath>
//                       </defs>
//                     </svg>

//                     <div className="text-lg mt-4 mb-2 leading-[1.2] font-medium text-white/70">Lochie Axon</div>
//                     <p className="text-sm font-medium text-white/60 mix-blend-plus-lighter">
//                       Lochie is a design engineer at Family.
//                     </p>
//                   </Link>
//                 </li>
//               </NavigationMenu.Link>
//               <ListItem href="/" title="Mariana Castilho">
//                 Product designer at poolside, previously Vercel.
//               </ListItem>
//               <ListItem href="/" title="Henry Heffernan">
//                 A design engineer at Vercel working on v0.
//               </ListItem>
//               <ListItem href="/" title="Dennis Brotzky">
//                 Co-founder of Fey, engineer who loves design.
//               </ListItem>

//             </ul>
//           </NavigationMenu.Content>
//         </NavigationMenu.Item>

//         <NavigationMenu.Item
//           className="list-none"
//         >
//           <NavigationMenu.Trigger className={TriggerStyle}>Lessons</NavigationMenu.Trigger>
//           <NavigationMenu.Content
//             className="menu-content"
//           >
//             <ul className="grid grid-flow-col grid-rows-3 gap-4 w-[564px] p-5.5">
//               <ListItem title="Theory" href="/">
//                 Consists of 4 modules, 24 lessons and 50+ exercises.
//               </ListItem>
//               <ListItem title="Interviews" href="/">
//                 Interviews with experts from companies like Vercel.
//               </ListItem>
//               <ListItem title="Discord" href="/">
//                 Join an exclusive community on all things animation.
//               </ListItem>
//               <ListItem title="Walkthroughs" href="/">
//                 Consists of 3 walkthroughs of high-quality components.
//               </ListItem>
//               <ListItem title="Vault" href="/">
//                 A highly curated list of animation resources.
//               </ListItem>
//               <ListItem title="Certificate" href="/">
//                 Get your certificate of completion after finishing 70% of the
//                 course.
//               </ListItem>
//             </ul>
//           </NavigationMenu.Content>
//         </NavigationMenu.Item>

//         <NavigationMenu.Item className="list-none">
//           <NavigationMenu.Link className={TriggerStyle}>Account</NavigationMenu.Link>
//         </NavigationMenu.Item>
//       </NavigationMenu.List>

//       <div className="absolute left-0 w-full top-full flex justify-center">
//         <NavigationMenu.Viewport className="viewport" />
//       </div>
//     </NavigationMenu.Root>
//   )
// }

// function ListItem({
//   className,
//   title,
//   children,
//   ...props
// }: {
//   className?: string;
//   title: string;
//   children: React.ReactNode;
// } & ComponentPropsWithoutRef<typeof NavigationMenu.Link>) {
//   return (
//     <NavigationMenu.Link
//       {...props}
//       className={cn(
//         "block min-w-0 rounded-sm px-3 py-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 cursor-pointer",
//         className,
//       )}
//       asChild
//     >
//       <li className="list-none">
//         <div className="font-medium">{title}</div>
//         <div className="mt-1 text-sm text-muted-foreground">{children}</div>
//       </li>
//     </NavigationMenu.Link>
//   )
// }
