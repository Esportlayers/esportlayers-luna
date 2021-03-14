import { AnimatePresence, motion } from "framer-motion";
import {
  EventTypes,
  KeywordMessageOverlay,
  useTetherMessageListener,
} from "@esportlayers/io";
import { ReactElement, useMemo, useState } from "react";

const variants = {
  hidden: {
    opacity: 0,
    y: "50%",
  },
  visible: {
    opacity: 1,
    y: "0px",
  },
};

function KeywordMessage({
  message,
  keyword,
}: {
  message: string;
  keyword: string;
}): ReactElement {
  const highlighted = message.replace(
    new RegExp(keyword, "ig"),
    `<span class='highlighted'>${keyword}</span>`
  );

  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: highlighted }} />
    </>
  );
}

export default function Overlay({
  testing,
}: {
  testing: boolean;
}): ReactElement {
  const { value } = useTetherMessageListener<KeywordMessageOverlay>(
    EventTypes.keyword_message_overlay
  ) || { value: null };
  const [data, setData] = useState<KeywordMessageOverlay["value"]>({
    time: 0,
    keyword: "#mykeyword",
    message: "What is the keyword? #myKeyword",
    logo: "https://avatars.githubusercontent.com/u/77932344",
    name: "esportlayers",
  });
  const [show, setShow] = useState(false);
  useMemo(() => {
    if (value) {
      setShow(true);
      setData(value);

      setTimeout(() => {
        setShow(false);
        setData(null);
      }, 15000);
    }
  }, [value]);

  return (
    <AnimatePresence>
      {(show || testing) && data && (
        <motion.div
          initial={"hidden"}
          animate={"visible"}
          exit={"hidden"}
          variants={variants}
          transition={{ duration: 1, type: "tween" }}
        >
          <div className={"messageContainer"}>
            <div className={"avatar"}>
              <img src={data.logo} alt={"User Logo"} width={100} height={100} />
            </div>

            <div className={"messageInfo"}>
              <div className={"user"}>@{data.name}</div>
              <div className={"message"}>
                <KeywordMessage message={data.message} keyword={data.keyword} />
              </div>
            </div>
          </div>

          <style jsx>{`
            .messageContainer {
              margin: 2rem 4rem;
              width: calc(100vw - 8rem);
              padding: 2rem 4rem;
              box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
              border-radius: 1rem;
              display: flex;
              align-items: center;
              background-color: #171b1f;
              color: #fff;
            }

            .avatar {
              background-color: #000;
              border-radius: 0.5rem;
              overflow: hidden;
              margin-right: 3rem;
              flex-shrink: 0;
            }

            img {
              max-width: 100%;
            }

            .user {
              margin-bottom: 1rem;
              font-weight: bold;
            }

            .messageInfo {
              font-size: 25px;
            }
          `}</style>
          <style jsx global>{`
            .highlighted {
              color: rgb(172, 81, 247);
              font-weight: bold;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
