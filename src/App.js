import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Link, Route, Redirect } from 'react-router-dom'
import * as Ethereum from './services/Ethereum'
import styles from './App.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/default.css'
import ContractInterface from './build/contracts/Wikipedia.json'
import Web3 from 'web3';


// Précédemment utilisé
const MonContratWiki = () => {
  if (window.ethereum) { // Check si le lien avec Metamask existe (Si notre navigateur est connecté à une blockchain)
    //console.log(Web3.givenProvider); // Crée un lien avec metamask. On peut aussi mettre l'adresse local si on a pas metamastk  : localhost:3000
    var web3 = new Web3(Web3.givenProvider); // interact with an Ethereum blockchain and Ethereum smart contracts.  Web3.givenProvider = Crée un lien avec metamask
    const contract = new web3.eth.Contract(ContractInterface.abi, ContractInterface.networks['5777'].address);
    return contract;

  }
  else {
    console.log("Erreur : initWeb3 not working well on App.js line 21");
    return;
  }

}


const ArticleRechercher = ({ idArticle }) => {

  const contract = useSelector(({ contract }) => contract)
  const [myarticletitle, setTitle] = useState(null);
  const [myarticlecontent, setContent] = useState(null)
  let [updateMode, setUpdateMode] = useState(false)

  //Cas où l'utilisateur entre l'url à la main : Pour corriger ça : Crée un ProtectedRoot pour qu'aucun utilisateur puisse y accéder à la main
  if (idArticle == null) {
    return (
      <div>
        <h1>Aucun ID</h1>
        <div>
          <h4>Il ne faut pas entrer l'url à la main ಠ_ಠ </h4>
          <small class="form-text text-muted">J'ai pas eu le temps de mettre en place de Route protéger...</small>
        </div>
      </div>
    )
  }

  contract.methods.articleTitle(idArticle).call().then(setTitle)
  contract.methods.articleContent(idArticle).call().then(setContent)

  if (myarticletitle === "" || myarticlecontent === "") {
    return (
      <div>
        <h1>ID invalide</h1>
        <div>
          <h4>Il faut entrer un id valide (╯°□°）╯︵ ┻━┻</h4>
        </div>
      </div>
    )
  }



  function updateContentArticle() {
    setUpdateMode(!updateMode)
  }

  // Async/await => J'attend que la transaction ai lieu avant de re-render mon composant avec le setContent
  async function validateUpdate() {
    let nouvelleValeur = document.getElementById("changeUpdate").value
    try{
      await contract.methods.updateArticle(idArticle, nouvelleValeur).send((error, result) => {
        if (error) {
          console.log("Transaction denied by the user")
        }
      });
    }catch (error){
      console.log("Transaction rejected")
    }
    setUpdateMode(false)
    
  }

  if (updateMode === false) {
    return (
      <div>
        <div>
          <h3>{myarticletitle}</h3>
        </div>
        <div id="theContentArticle" onDoubleClick={updateContentArticle} >
          {myarticlecontent}
        </div>
      </div>
    )
  }
  else {
    return (
      <div>
        <div>
          <h3>{myarticletitle}</h3>
        </div>
        <textarea className="form-control" id="changeUpdate" type="text" defaultValue={myarticlecontent} />
        <button onClick={validateUpdate}>O</button>
        <button onClick={updateContentArticle}>X</button>
      </div>
    )
  }

}

/*
*
* Composant de creation d'un nouvelle article
*/
const NewArticle = () => {

  const contract = useSelector(({ contract }) => contract)
  let [ajoutArticle, setAjoutArticle] = useState(false)

  async function addArticle(e) {

    //Permet de ne pas rafraichir la page avant d'avoir executer la fonction
    e.preventDefault();
    // On récupère le titre et le contenue du formulaire
    var title = document.getElementById("articleTitle");
    var contenue = document.getElementById("contentOfTheArticle");

    //On crée un article : Pour crée un article, on effectue une transaction payante
    try{
      await contract.methods.addArticle(title.value, contenue.value).send(function (error, result) {
        if (error) {
          console.log("Transaction denied by the user")
        }
      });
      setAjoutArticle(!ajoutArticle)
      console.log("Operation d'ajout est un succès");
    }catch(error){
      console.log("Transaction rejected")
    }

    //Je vérifie que l'ajout à bien eu lieu en checkant toutes les ids de ma map
    contract.methods.getAllIds().call().then(console.log)

  }

  if (ajoutArticle) {
    return (
      <div>
        <h2>L'article a été ajouté avec succès (•̀ᴗ•́)و ̑̑</h2>
        <div><Link to="/">Home</Link></div>
      </div>
    )
  }
  else {

    return (

      <form onSubmit={addArticle}>
        <div className="form-group">
          <label htmlFor="TitleOfTheArticle">Titre de l'article</label>
          <input type="text" className="form-control" id="articleTitle" placeholder="Entrez le titre de l'article" />
        </div>
        <div className="form-group">
          <label htmlFor="contentOfTheArticle">Contenue de l'article</label>
          <textarea className="form-control" id="contentOfTheArticle" placeholder="Il était une fois.." />
        </div>
        <button type="submit" className="btn btn-primary">Publier</button>
      </form>

    )

  }

}


const Home = () => {
  return (
    <div className={styles.links}>
      <Link to="/">Home</Link>
      <Link to="/article/new">Add an article</Link>
      <Link to="/article/all">All articles</Link>
    </div>
  )
}




const AllArticles = ({ sendDataToParent }) => {
  

  const contract = useSelector(({ contract }) => contract)
  const [selectArticleById, setId] = useState(false); //Si l'utilisateur à choisi de rechercher un article, on met à true
  let numId = document.getElementById("myid");

  const [articles, setArticles] = useState([]);

  useEffect(() => {

    
    if (contract) {
      contract.methods.getAllIds().call().then((id) => {
        const tab = []
        id.map((x) => {
          contract.methods.articleTitle(x).call().then((k, v) => {

            tab.push(k)
            setArticles([...tab])
          })

        })
      })
    }
  }, [contract])


  function findArticle() {
    numId = document.getElementById("myid");
    sendDataToParent(numId.value)
    setId(true)
  }


  if (selectArticleById) {

    return (
      <div>
        <Redirect
          to={{
            pathname: "/article/byid",
          }}
        />
      </div>
    )
  }
  else {
    return (
      <div id="articlesPageId">
        <div id="articleById">
          <form onSubmit={() => findArticle()}>
            <div className="form-group">
              <label htmlFor="myid">ID de l'article</label>
              <input type="text" className="form-control" id="myid" placeholder="Entrez l'id de l'article à rechercher" />
            </div>
            <button type="submit" className="btn btn-primary">Rechercher</button>
          </form>
        </div>

        <div>
          {articles.map((k, v) => <li>id : {v} <div>{k}</div></li>)}
        </div>

      </div>
    )
  }

  //------------------Truc du prof ------------------------//

  // const [articles, setArticles] = useState([])
  // //const contract = useSelector(({contract}) => contract)
  // useEffect(() => {
  //   if (contract) {
  //     contract.methods.articleContent(0).call().then(console.log)
  //     contract.methods.getAllIds().call().then(console.log)
  //   }
  //   else
  //     console.log("Nothing found you")
  // }, [contract, setArticles])
  // return <div>{articles.map(article => article)}</div>

}

const NotFound = () => {
  return <div>Not found</div>
}

const App = () => {

  const [idArticle, setIDArticle] = useState(null);

  const sendDataToParent = (index) => {
    setIDArticle(index);
  }

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(Ethereum.connect)
  }, [dispatch])

  return (
    <div className={styles.app}>
      <div className={styles.title}>Welcome to Decentralized Wikipedia</div>
      <Switch>
        <Route path="/article/new">
          <NewArticle />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/article/all">
          <AllArticles sendDataToParent={sendDataToParent} />
        </Route>
        <Route path="/article/byid">
          <ArticleRechercher idArticle={idArticle} />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  )
}

export default App


