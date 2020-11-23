import { useContext, useState, useEffect } from "react";
import { getSession, signin } from "next-auth/client";

import Link from "next/link";

import styles from "../../styles/create.module.scss";

import PackAppsList from "../../components/PackAppsList";
import SelectedContext from "../../ctx/SelectedContext";

import PageWrapper from "../../components/PageWrapper";

import { FiPackage, FiTwitter} from "react-icons/fi";
import MetaTags from "../../components/MetaTags";
import SelectionBar from "../../components/SelectionBar";
import CreatePackForm from "../../components/CreatePackForm";
import FeaturePromoter from "../../components/FeaturePromoter";

function Create({ allApps }) {
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);
    const [user, setUser] = useState(); 
    const [packApps, setPackApps] = useState([]);

    useEffect(() => {
      setPackApps(selectedApps);

      const restoreBackup = async () => {
        const checkForBackup = await localStorage.getItem("winstallLogin")

        const backup = JSON.parse(checkForBackup);

        if(!backup) return;

        setSelectedApps(backup);
        setPackApps(backup);

        await localStorage.removeItem("winstallLogin");

      }

      restoreBackup();

      getSession().then(async (session) => {
        if(!session) return;

        if(session.user) setUser(session.user);

        setSelectedApps([]);
      });

    }, [])

    const handleLogin = async () => {
      const appsBackup = JSON.stringify(selectedApps);
      
      await localStorage.setItem("winstallLogin", appsBackup);

      signin("twitter");
    }

    const updatePackApps = (apps) => {
      setPackApps(apps);
  }

  if(!user){
    return (
      <PageWrapper>
        <MetaTags title="Create a pack - winstall" />
        <FeaturePromoter  art="/assets/packsPromo.svg" disableHide={true}>
          <h3>One more thing...</h3>
          <h1>Welcome! Login with Twitter to be able to create a pack.</h1>
          <button
            className={styles.button}
            onClick={handleLogin}
          >
            <div>
              <FiTwitter />
              Login
            </div>
          </button>
        </FeaturePromoter>
      </PageWrapper>
    )
  }

    return (
      <PageWrapper>
        <MetaTags title="Create a pack - winstall" />

        <div className={styles.content}>
          <h1>Create a pack</h1>

          { user && (
            <>
              <CreatePackForm user={user} packApps={packApps} editMode={false}/>

              <br/>

              <PackAppsList notLoggedIn={user === null} providedApps={packApps} reorderEnabled={true} allApps={allApps} onListUpdate={updatePackApps}/>
            </>
          )}

          

        </div>

        <SelectionBar hideCreatePack={true}/>
      </PageWrapper>
    );
}

export async function getStaticProps() {
  let apps = await fetch(`https://api.winstall.app/apps`).then((res) =>
      res.json()
  );

  return {
      props: {
          allApps: apps,
      },
  };
}


export default Create;
