import Header from "./components/Header/Header";

export default function Home() {
  return (
    <div className="bg-[#918a8a] w-full min-h-screen pt-4">
      <Header />
      <SearchBar setSearchTerm={setSearchTerm} />
    </div>
  );
}
