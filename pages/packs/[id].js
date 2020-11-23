import styles from "../../styles/packPage.module.scss";

import Error from "../../components/Error";

import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { useRouter } from "next/router";
import MetaTags from "../../components/MetaTags";
import { useEffect, useState, useContext } from "react";
import PageWrapper from "../../components/PageWrapper";
import PackAppsList from "../../components/PackAppsList";
import SelectionBar from "../../components/SelectionBar";
import SelectedContext from "../../ctx/SelectedContext";
import { timeAgo } from "../../utils/helpers";
import { FiCodepen, FiPackage, FiCopy, FiDownload, FiShare2, FiClock, FiEdit, FiTrash } from "react-icons/fi";
import Toggle from "react-toggle";
import { getSession } from "next-auth/client";

function AppSkeleton() {
    return (
      <div>
        <Skeleton count={1} height={30} width={250}/>

        <div className="skeleton-group centre">
          <Skeleton circle={true} height={28} width={28} />
          <Skeleton count={1} height={25} width={80}/>
        </div>
        <Skeleton count={3} height={20} width="80%"/>
        <div className="skeleton-button">
          <Skeleton count={1} width={140} height={45} />&nbsp;
          <Skeleton count={1} width={140} height={45} />
        </div>
        <div className="skeleton-list left">
          <Skeleton count={2} height={120}/>
        </div>
        <Skeleton count={1} height={120}   />
      </div>
    );
}

function ScriptCode({apps}){
  const [copyText, setCopyText] = useState("Copy to clipboard");
  const [script, setScript] = useState("");
  const [showPS, setShowPS] = useState(false);

  let handleScriptChange = () => {
    let installs = [];

    apps.map((app) => {
      installs.push(
        `winget install --id=${app._id} ${
        app.selectedVersion !== app.latestVersion
          ? `-v "${app.selectedVersion}" `
          : ""
        }-e`
      );

      return app;
    });

    let newScript = installs.join(showPS ? " ; " : " && ");

    if (script !== newScript) {
      setCopyText("Copy to clipboard");
    }

    setScript(newScript);
  };

  useEffect(() => {
    handleScriptChange();
  }, [handleScriptChange]);

  let handleCopy = () => {
    navigator.clipboard.writeText(script).then(() => setCopyText("Copied!")).catch((err) => {
      document.querySelector("textarea").select();
    })
  }

  let handleBat = () => {
    let dl = document.querySelector("#gsc");
    dl.setAttribute("download", `winstall${showPS ? ".ps1" : ".bat"}`)
    dl.href = "data:text/plain;base64," + btoa(script);
    dl.click();
  }

  let handleScriptSwitch = () => {
    setShowPS(!showPS);

    if (!showPS) {
      setScript(script.replace(/&&/g, ";"));
    } else {
      setScript(script.replace(/;/g, "&&"));
    }

    setCopyText("Copy to clipboard")
  }

  return (
    <div className={styles.getScript} id="packScript">

      <div className={styles.scriptHeader}>
        <h3>Get the pack script</h3>
        <div className="switch min">
          <Toggle
            id="biscuit-status"
            defaultChecked={showPS}
            aria-labelledby="biscuit-label"
            onChange={handleScriptSwitch}
          />
          <span id="biscuit-label">Show PowerShell script</span>
        </div>
      </div>
      
      <p>You can copy-paste the following script into a terminal window to get all the apps in this pack. Alternatively, you can download the .bat or .ps1 file to quickly install this pack.</p>

      <textarea
        value={script}
        onChange={() => { }}
        onFocus={(e) => e.target.select()}
      />

      <div className="box">
        <button className="button accent" onClick={handleCopy}>
          <FiCopy />
          {copyText}
        </button>

        <button className="button dl" onClick={handleBat}>
          <FiDownload />
                Download {showPS ? ".ps1" : ".bat"}
        </button>
      </div>
    </div>
  )
}

function PackDetail({ pack, creator }) {
    const router = useRouter();
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);
    const [user, setUser] = useState();
    const [deleting, setDeleting] = useState(false);
    const [deleteLabel, setDeleteLabel] = useState("Delete Pack");

    useEffect(() => {
      getSession().then(async (session) => {
        if(!session){
          return;
        };
  
        setUser(session.user)
      });
    }, []);

    const fallbackMessage = {
        title: "Sorry! We could not load this pack.",
        subtitle: "Unfortunately, this pack could not be loaded. Either it does not exist, or something else went wrong. Please try again later."
    }

    if(!router.isFallback && !pack){
        return <Error {...fallbackMessage}/>
    }

    const handleSelectAll = () => {
      const updatedList = [...selectedApps, ...pack.apps];

      let uniqueList = [...new Map(updatedList.map(item => [item["_id"], item])).values()]

      setSelectedApps(uniqueList);
    }

    const handleShare = () => {
      const link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Checkout the "${pack.title}" pack by @${creator.screen_name}!`)}&url=${encodeURIComponent(`https://winstall.app/packs/${pack._id}`)}&via=winstallHQ`
      
      window.open(link)
    }

    const deletePack = async () => {
      if(!user) return;

      setDeleting(true);
      setDeleteLabel("Deleting...");

      await fetch(
          `https://api.winstall.app/packs/${pack._id}`,
          {
              method: "DELETE",
              headers: {
                  'Authorization': `${user.accessToken},${user.refreshToken}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ creator: pack.creator })
          }
      ).then((data) => data.json()).then((data) => {
          if(data.msg){ // sucessfully deleted
              setDeleteLabel("Deleted!");
              localStorage.removeItem("ownPacks");
              router.push("/packs");
          }
      });
  }

  const handleDelete = async (e) => {
      if(deleting) return;

      if ('confirm' in window && typeof window.confirm === 'function') {
          if (window.confirm("Are you sure you want to delete this pack?")) {
              deletePack();
          }
      } else {
          deletePack();
      }

  }

  return (
    <PageWrapper>
      <div className={styles.content}>
        {router.isFallback ? (
          <AppSkeleton />
        ) : (
          <div>
            <MetaTags title={`${pack.title} - winstall`} desc={`Includes ${pack.apps[0].name}, ${pack.apps[1].name}, ${pack.apps[2].name}, and more!`} />

            <h1>{pack.title}</h1>

            <Link
              href="/users/[id]"
              as={`/users/${creator.id_str}`}
              prefetch={false}
            >
              <a className={styles.author} title="View other packs by this user">
                <img
                  src={creator.profile_image_url_https}
                  alt="pack creator image"
                />
                @{creator.screen_name}
              </a> 
            </Link>

            <p>{pack.desc}</p>
            <p className={styles.time}><FiClock/> Last updated {timeAgo(pack.updatedAt)} </p>

            <div className={styles.packGet}>
              <a
                className="button lightText"
                href="#packScript"
                id={pack.accent}
              >
                <FiCodepen /> Get Pack
              </a>
              <a className="button" onClick={handleSelectAll}>
                <FiPackage /> Select Apps
              </a>
                <a
                  className="button"
                  onClick={handleShare}
                >
                  <FiShare2 /> Share
              </a>
            </div>

            {
              (user && (user.id === pack.creator)) && (
                <div className={styles.packGet}>
                  <Link href={`/packs/edit?id=${pack._id}`} prefetch={false}>
                    <a className="button subtle">
                        <FiEdit /> Edit Pack
                    </a>
                  </Link> &nbsp;
        
                  <a
                      className="button subtle"
                      onClick={handleDelete}
                    >
                      <FiTrash /> {deleteLabel}
                  </a>
                  
                </div>
              )
            }

            <PackAppsList providedApps={pack.apps} reorderEnabled={false} />

            <ScriptCode apps={pack.apps} />
          </div>
        )}

        {/* <PackAppsList providedApps={packApps} reorderEnabled={false}/> */}
      </div>

      <SelectionBar />
    </PageWrapper>
  );
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    console.log("Getting content from API")

    try{
      let pack = await fetch(`https://api.winstall.app/packs/${params.id}`).then(res => res.json());

      let creator = await fetch(`https://api.twitter.com/1.1/users/show.json?user_id=${pack.creator}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TWITTER_BEARER}`
        }
      }).then(res => res.json())

      let appsList = pack.apps;

      const getIndividualApps = appsList.map(async (app, index) => {
        return new Promise(async (resolve) => {
          let appData = await fetch(`https://api.winstall.app/apps/${app._id}`).then(res => res.ok ? res.json() : null);
         
          appsList[index] = appData;
          resolve();
        })
      })

      await Promise.all(getIndividualApps).then(() => {
        pack.apps = appsList.filter(app => app != null);
      })
      
      return { props: pack ? { pack, creator } : {}, revalidate: 600 }
      
    } catch(err) {
        console.log(err.message)
        return { props: {} };
    }
}

export default PackDetail;