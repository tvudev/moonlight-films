import { FunctionComponent } from "react";
import { AiFillStar, AiTwotoneCalendar } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import {
  DetailMovie,
  DetailSeason,
  DetailTV,
  Episode,
  getWatchReturnedType,
} from "../../shared/types";
import { embedMovie, embedTV } from "../../shared/utils";
import RightbarFilms from "../Common/RightbarFilms";
import SearchBox from "../Common/SearchBox";
import SidebarMini from "../Common/SidebarMini";
import Title from "../Common/Title";
import ReadMore from "../FilmDetail/ReadMore";
import SeasonSelection from "./SeasonSelection";

interface FilmWatchProps {
  media_type: "movie" | "tv";
  seasonId?: number;
  episodeId?: number;
  currentEpisode?: Episode;
  currentSeason?: DetailSeason;
}

const FilmWatch: FunctionComponent<FilmWatchProps & getWatchReturnedType> = ({
  detail,
  recommendations,
  detailSeasons,
  media_type,
  seasonId,
  episodeId,
  currentEpisode,
  currentSeason,
}) => {
  return (
    <>
      <Title
        value={`Watch: ${
          (detail as DetailMovie).title || (detail as DetailTV).name
        } ${
          media_type === "tv" && `- Season ${seasonId} - Ep ${episodeId}`
        } | Moonlight`}
      />

      <div className="flex">
        <SidebarMini />
        <div className="flex-grow px-[2vw] pt-11">
          <div className="relative h-0 pb-[56.25%]">
            <iframe
              className="absolute w-full h-full top-0 left-0"
              src={
                media_type === "movie"
                  ? embedMovie(detail.id)
                  : embedTV(detail.id, seasonId as number, episodeId as number)
              }
              title="Film Video Player"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <div className="mt-5 pb-8">
            <div className="flex justify-between">
              <div>
                <h1 className="text-white text-3xl font-medium">
                  <Link
                    to={
                      media_type === "movie"
                        ? `/movie/${detail.id}`
                        : `/tv/${detail.id}`
                    }
                    className="hover:brightness-75 transition duration-300"
                  >
                    {(detail as DetailMovie).title || (detail as DetailTV).name}
                  </Link>
                </h1>
                <div className="flex gap-5 mt-5">
                  <div className="flex gap-2 items-center">
                    <AiFillStar size={25} className="text-primary" />
                    {media_type === "movie" && (
                      <p>{detail.vote_average.toFixed(1)}</p>
                    )}
                    {media_type === "tv" && (
                      <p>{currentEpisode?.vote_average.toFixed(1)}</p>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <AiTwotoneCalendar size={25} className="text-primary" />
                    <p>
                      {media_type === "movie" &&
                        new Date(
                          (detail as DetailMovie).release_date
                        ).getFullYear()}
                      {media_type === "tv" &&
                        new Date(
                          (currentEpisode as Episode).air_date
                        ).getFullYear()}
                    </p>
                  </div>
                </div>
                <ul className="flex gap-2 flex-wrap mt-3">
                  {detail.genres.map((genre) => (
                    <li key={genre.id} className="mb-2">
                      <Link
                        to={`/explore?genre=${genre.id}`}
                        className="px-3 py-1 bg-dark-lighten rounded-full hover:brightness-75 duration-300 transition"
                      >
                        {genre.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {media_type === "tv" && (
                <div>
                  <h2 className="text-xl italic uppercase text-gray-200 mt-2 text-right">
                    {currentEpisode?.name}
                  </h2>
                  <p className="text-right text-lg mt-2">
                    Season: {seasonId} &#8212; Episode {episodeId}
                  </p>
                </div>
              )}
            </div>
            <div className="text-xl font-medium text-white mt-5">Overview:</div>
            <ReadMore limitTextLength={300} className="text-lg mt-1">
              {media_type === "movie"
                ? detail.overview
                : currentEpisode?.overview}
            </ReadMore>
          </div>
        </div>
        <div className="shrink-0 max-w-[400px] w-full relative px-6">
          <SearchBox />
          {media_type === "movie" && (
            <RightbarFilms
              name="Recommendations"
              films={recommendations}
              limitNumber={4}
              isLoading={!recommendations}
              className="mt-24"
            />
          )}
          {media_type === "tv" && (
            <div className="mt-24">
              <p className="mb-6 text-xl font-medium flex justify-between items-center">
                <span className="text-white">Seasons:</span>
                <BsThreeDotsVertical size={20} />
              </p>
              <SeasonSelection
                detailSeasons={detailSeasons}
                seasonId={seasonId}
                episodeId={episodeId}
              />
            </div>
            // <ul className="mt-24 overflow-auto flex flex-col gap-10">
            //   {(detailSeasons as DetailSeason[]).map((season) => (
            //     <li key={season.id}>
            //       <div className="flex gap-3 items-center">
            //         <div className="shrink-0 max-w-[120px] w-full">
            //           <LazyLoadImage
            //             src={resizeImage(season.poster_path, "w92")}
            //             alt=""
            //             effect="opacity"
            //             className="object-cover w-[120px] h-full rounded-md"
            //           />
            //         </div>
            //         <div className="flex-grow">
            //           <div className="mb-3 flex justify-between">
            //             <p className="text-white font-medium">{season.name}</p>
            //             <p>{season.episode_count} episodes</p>
            //           </div>
            //           <ReadMore
            //             limitTextLength={130}
            //             className="mb-2 inline-block"
            //           >
            //             {season.overview}
            //           </ReadMore>
            //           <p className="text-base">{season.air_date}</p>
            //         </div>
            //       </div>
            //     </li>
            //   ))}
            // </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default FilmWatch;