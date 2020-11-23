import styles from "../styles/singleApp.module.scss";
import LazyLoad from "react-lazyload";
import popularAppsList from "../data/popularApps.json";

const AppIcon = ({id, name, icon}) => {
    // if the app is listed in popularApps, use the image specified there
    const popularApps = Object.values(popularAppsList).filter((app) => app._id === id);
    if (popularApps.length === 1) {
      return (
        <AppPicture
          name={name}
          srcSetPng={`/assets/apps/fallback/${popularApps[0].img.replace("webp", "png")}`}
          srcSetWebp={`/assets/apps/${popularApps[0].img}`}
        />
      );
    }
  
    if(!icon){ // if we don't have an icon, we mimmick one with app initials
        const nameParts = name.split(" ");
        let initials = name[0].substr(0, 1).toUpperCase();

        if(nameParts.length > 1){
            let secondChar = nameParts[nameParts.length-1].substr(0, 1).toUpperCase();

            // make sure the second character we are about to add is alphanumerical 
            if(secondChar.match(/^[a-z0-9]+$/i)){
                initials += secondChar;
            }
        }

        return <span className={styles.noIcon}>{initials}</span>;
    }
    
    if (icon.startsWith("http")) {
      return (
        <LazyLoad height={25} offset={300} once>
          { // if icon is not hosted on winstall
            icon.startsWith("http") && (
              <img
                src={icon}
                draggable={false}
                alt={`Logo for ${name}`}
              />
            )
          }
        </LazyLoad>
      );
    }

    icon = icon.replace(".png", "")

    return (
      <AppPicture
        name={name}
        srcSetPng={`https://api.winstall.app/icons/${icon}.png`}
        srcSetWebp={`https://api.winstall.app/icons/next/${icon}.webp`}
      />
    );
}

const AppPicture = ({ name, srcSetPng, srcSetWebp }) => {
  return (
    <LazyLoad height={25} offset={300} once>
      <picture>
        <source srcSet={srcSetWebp} type="image/webp" />
        <source srcSet={srcSetPng} type="image/png" />
        <img src={srcSetPng} alt={`Logo for ${name}`} draggable={false} />
      </picture>
    </LazyLoad>
  );
}

export default AppIcon;