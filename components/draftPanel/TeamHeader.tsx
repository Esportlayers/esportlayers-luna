import { ReactElement } from "react";
import classNames from "classnames";

interface Props {
  dire?: boolean;
  logo: string;
  name: string;
  twitter: string;
}

export default function TeamHeader({
  dire,
  logo,
  name,
  twitter,
}: Props): ReactElement {
  return (
    <div className={classNames("team", { dire })}>
      <div className={"teamLogoWrapper"}>
        <img src={logo} alt={"IVY Logo"} className={"teamLogo"} />
      </div>
      <div className={"teamName"}>{name}</div>
      <div className={"teamTwitter"}>{twitter}</div>

      <style jsx>{`
        .team {
          display: flex;
          align-items: center;
          font-family: "Rubik";
        }

        .dire {
          flex-direction: row-reverse;
        }

        .teamLogoWrapper {
          height: 50px;
          width: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .teamLogo {
          object-fit: contain;
          max-width: 100%;
          max-height: 100%;
        }

        .teamName {
          font-size: 35px;
          font-weight: bold;
          color: #444;
          margin: 0 1rem 0 2rem;
        }

        .teamTwitter {
          color: #00acee;
          font-size: 25px;
        }
      `}</style>
    </div>
  );
}
