import PageWrapper from "../../components/PageWrapper";
import MetaTags from "../../components/MetaTags";
import SelectionBar from "../../components/SelectionBar";
import styles from "../../styles/apps.module.scss";
import PackPreview from "../../components/PackPreview";
import Link from "next/link";
import { FiChevronLeft, FiPlus, FiChevronRight, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import FeaturePromoter from "../../components/FeaturePromoter";
import { useState} from "react";

export default function Packs({ packs }) {
    const [offset, setOffset] = useState(0);

    const itemsPerPage = 60;
    const totalPages = Math.ceil(packs.length / itemsPerPage);

    let handleNext = () => {
        window.scrollTo(0, 0)
        setOffset(offset => offset + itemsPerPage);
      }
  
      let handlePrevious = () => {
        window.scrollTo(0, 0)
        setOffset(offset => offset - itemsPerPage);
      }

    const Pagination = ({ small, disable }) => {
        return (
          <div className={small ? styles.minPagination : styles.pagbtn}>
            <button
              className={`button ${small ? styles.smallBtn : null}`}
              id={!small ? "previous": ""}
              onClick={handlePrevious}
              title="Previous page of packs"
              disabled={offset > 0 ? (disable ? "disabled" : null) : "disabled"}
            >
              <FiChevronLeft />
              {!small ? "Previous" : ""}
            </button>
            <button
              className={`button ${small ? styles.smallBtn : null}`}
              id={!small ? "next" : ""}
              title="Next page of packs"
              onClick={handleNext}
              disabled={offset + itemsPerPage < packs.length ? ( disable ? "disabled" : null ) : "disabled"}
            >
              {!small ? "Next" : ""}
              <FiChevronRight />
            </button>
          </div>
        );
      }

      
    return (
        <PageWrapper>
            <MetaTags title="Packs - winstall" desc="Checkout the community's app collections for your new Windows 10 machine." />

            <div>
                <FeaturePromoter art="/assets/packsPromo.svg" promoId="packs" disableHide={true}>
                    <h3>Introducing Packs</h3>
                    <h1>Curate and share the apps you use daily.</h1>
                    <div className="box2">
                        <Link href="/packs/create"><button className="button spacer accent" id="starWine"><FiPlus/> Create a pack</button></Link>
                    </div>
                </FeaturePromoter>

                <div className={styles.controls}> 
                    <div>
                        <h1>All packs {`(${packs.length})`}</h1>
                        <p>
                            Showing {packs.slice(offset, offset + itemsPerPage).length} packs
                            (page {Math.round((offset + itemsPerPage - 1) / itemsPerPage)} of{" "}
                            {totalPages}).
                        </p>
                    </div>
                    <Pagination small/> 
                </div>

        
                
                <ul className={`${styles.all} ${styles.storeList}`}>
                    {packs.slice(offset, offset + itemsPerPage).map(pack => <li key={pack._id}><PackPreview pack={pack} /></li>)}
                </ul>

                <div className={styles.pagination}>
                    <Pagination/>
                    <em>
                        Hit the <FiArrowLeftCircle /> and <FiArrowRightCircle /> keys
                        on your keyboard to navigate between pages quickly.
                    </em>
                </div>
            </div>

            <SelectionBar />
        </PageWrapper>
    )
}


export async function getStaticProps() {
    let packs = await fetch(`https://api.winstall.app/packs`).then((res) =>
        res.json()
    );


    const officialPacks = process.env.NEXT_OFFICIAL_PACKS_CREATOR;

    packs = packs.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    packs = packs.sort((a, b) => a.creator === officialPacks ? -1 : 1)

    return {
        props: {
            packs,
        },
        revalidate: 600
    };
}