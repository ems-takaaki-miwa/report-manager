// import type { Route } from "./+types/home";
// import { NavLink } from "react-router";
// import FileCard from "~/components/fileCard";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

// export default function Home() {
//   // サンプルデータ
//   const files = [
//     { title: "タイトル1", fileDate: "2024/12/31" },
//     { title: "タイトル2", fileDate: "2024/12/30" },
//     { title: "タイトル3", fileDate: "2024/12/29" },
//     { title: "タイトル4", fileDate: "2024/12/28" },
//     { title: "タイトル5", fileDate: "2024/12/27" },
//   ];

//   return (
//     <>
//       <NavLink to="/login" end>
//         login
//       </NavLink>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
//         {files.map((file, index) => (
//           <FileCard
//             key={index}
//             title={file.title}
//             fileDate={file.fileDate}
//           />
//         ))}
//       </div>
//     </>
//   );
// }
