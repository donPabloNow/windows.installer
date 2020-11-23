import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/create.module.scss";
import Link from "next/link";

const CreatePackForm = ({ user, packApps, editMode, defaultValues, isDisabled }) => {
    const { handleSubmit, register, errors } = useForm({ defaultValues });
    const [creating, setCreating] = useState(false);
    const [created, setCreated] = useState();
    const [error, setError] = useState("");
    const router = useRouter();

    const onSubmit = async (values) => {
        setCreating(true);

        const apps = packApps.map(app => {
          return {
            _id: app._id,
            name: app.name,
            icon: app.icon
          }
        })

        if(apps.length < 5){
          setError(`You need at least 5 apps to be able to ${editMode ? "update" : "create"} this pack.`);
          setCreating(false);
          return;
        }

        await fetch(
            editMode ? `https://api.winstall.app/packs/${defaultValues._id}` : `https://api.winstall.app/packs/create`,
            {
                method: editMode ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `${user.accessToken},${user.refreshToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  title: values.title,
                  desc: values.description,
                  apps: JSON.stringify(apps),
                  creator: user.id,
                  accent: values.accent
                }),
                redirect: 'follow'
            }
        ).then(async (data) => {
          if(data.status !== 200){
              const res = await data.json();
              setCreating(false);
              setError(res.error);
              return;
          }

          return data.json()
        }).then(data => {
            localStorage.removeItem("ownPacks");
            router.push(`/packs/${data._id}`)
            setCreated(data)
        })
        .catch(error => {
            setCreating(false);
            setError(error.message);
        });
    };

    if(created){
        return (
        <p>Your pack has been sucesfully {editMode ? "updated" : "created"}! You can view it here: <Link href="/packs/[id]" as={`/packs/${created._id}`}><a>winstall.app/packs/{created._id}</a></Link></p>
        )
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.createForm}>
        <label>
          Pack title
          <input
            name="title"
            type="text"
            placeholder="Give your pack a name"
            ref={register({
              required: true,
              validate: (value) => { return value.replace(/\s/g, '').length === 0 ? false : true; }
            })}
            autoComplete="off"
          />
          {errors.title && <span className={styles.formError}>Please check the name of your pack!</span>}
        </label>

        <label>
          Pack description
          <input
            name="description"
            type="text"
            ref={register({
                required: true,
                validate: (value) => { return value.replace(/\s/g, '').length === 0 ? false : true; }
            })}
            placeholder="Give your pack a short description"
            autoComplete="off"
          />
          {errors.description && <span className={styles.formError}>Please check the description of your pack!</span>}
        </label>

        <label>
          Pack accent
          
          <div className={styles.accents}>
            <label htmlFor="winterNeva"><input defaultChecked={true} type="radio" id="winterNeva" name="accent" value="winterNeva" ref={register({ required: true })} /><p>Winter Neva</p></label>
            <label htmlFor="deepBlue"><input type="radio" id="deepBlue" name="accent" value="deepBlue" ref={register({ required: true })} /><p>Deep Blue</p></label>
            <label htmlFor="starWine"><input type="radio" id="starWine" name="accent" value="starWine" ref={register({ required: true })} /><p>Star Wine</p></label>
            <label htmlFor="purpleDivision"><input type="radio" id="purpleDivision" name="accent" value="purpleDivision" ref={register({ required: true })} /><p>Purple Divison</p></label>
            <label htmlFor="loveKiss"><input type="radio" id="loveKiss" name="accent" value="loveKiss" ref={register({ required: true })} /><p>Love Kiss</p></label>
          </div>

          {errors.accent && <span className={styles.formError}>Please check the accent of your pack!</span>}
        </label>
        <button type="submit" className="button" disabled={creating || created || isDisabled}>
          {creating ? (editMode ? "Updating..." : "Creating...") : (editMode ? "Update Pack" : "Create pack")}
        </button>

        {error && <p>Couldn't {editMode ? "update" : "add"} pack! Error: {error}</p>}
      </form>
    );
}

export default CreatePackForm;