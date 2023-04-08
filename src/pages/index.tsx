import { type NextPage } from "next";
import Head from "next/head";
import { type ChangeEvent, useState } from "react";
import debounce from "lodash/debounce";
import Image from "next/image";

import { exercises } from "config/exercises";

const getExercises = (searchTerm: string) => {
  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscleGroups.some((muscleGroup) =>
        muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return filteredExercises;
};

const SearchBar = ({
  addExercise,
}: {
  addExercise: (exercise: (typeof exercises)[0]) => void;
}) => {
  const [searchResults, setSearchResults] = useState<typeof exercises>([]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      setSearchResults(getExercises(e.target.value));
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="border-b px-8 py-4">
      <input
        type="text"
        placeholder="Search"
        className="w-full p-2 text-2xl"
        onChange={debounce(
          (e) => handleSearch(e as ChangeEvent<HTMLInputElement>),
          1000
        )}
      />

      <div
        className={
          "flex max-h-[200px] min-h-[200px] flex-col space-y-2 overflow-y-scroll border-stone-400 bg-slate-400 p-2"
        }
      >
        {searchResults.length === 0 && (
          <div className="flex items-center justify-center">
            <p className="text-2xl">No results</p>
          </div>
        )}
        {searchResults.map((exercise, index) => (
          <button
            key={index}
            className="flex items-center space-x-2 border border-slate-500"
            onClick={() => addExercise(exercise)}
          >
            {exercise.name}
            <Image
              src={`/images/${exercise.id}.svg`}
              alt={exercise.name}
              width={100}
              height={100}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const [selectedExercises, setSelectedExercises] = useState<typeof exercises>(
    []
  );

  const addExercise = (exercise: (typeof exercises)[0]) => {
    setSelectedExercises([...selectedExercises, exercise]);
  };

  return (
    <>
      <Head>
        <title>Gym Planner</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col space-y-2">
        <SearchBar addExercise={addExercise} />
        <div className="flex flex-col space-y-2 overflow-y-scroll">
          {selectedExercises.map((exercise, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <p>{exercise.name}</p>
              <Image
                src={`/images/${exercise.id}.svg`}
                alt={exercise.name}
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
