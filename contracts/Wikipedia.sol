pragma solidity ^0.5.0;

contract Wikipedia {
    struct Article {
        string title;
        string content;
        uint lenhistory;
        mapping(uint256 => string) history;
    }

    uint256 public uniqueID = 1;
    uint256[] public ids;
    mapping(uint256 => Article) public articlesById;

    constructor() public {
        uint256 index = 0;
        ids.push(index);
        Article memory newArticle = Article(
            'Mon premier article',
            'Il est genial, vraiment !',
            0
        );
        articlesById[index] = newArticle;
    }

    function articleContent(uint256 index) public view returns (string memory) {
        return articlesById[index].content;
    }

    function historyContent(uint256 idArticle, uint256 indexHistory)  public view returns (string memory) {

        return string(articlesById[idArticle].history[indexHistory]);
    }

    function getHistoryLength(uint256 index) public view returns (uint256) {
        return articlesById[index].lenhistory;
    }

    function getAllIds() public view returns (uint256[] memory) {
        return ids;
    }

    // Write your code here.

    function getID() private returns (uint256) {
        return uniqueID++;
    }

    function articleTitle(uint256 index) public view returns (string memory) {
        return articlesById[index].title;
    }

    function addArticle(string memory title, string memory content, string memory date)
        public
        returns (bool)
    {
        uint256 index = getID();
        ids.push(index);

        Article memory newArticle = Article(title, content, 1);
        articlesById[index] = newArticle;

        articlesById[index].history[0] = string(abi.encodePacked(date, ":\n ", content));

        return true;
    }

    function updateArticle(uint256 index, string memory content, string memory date) public returns (bool) {
        Article memory a = articlesById[index];
        string memory title = a.title;
        uint historyLength = a.lenhistory;

        Article memory newArticle = Article(title, content, historyLength);
        articlesById[index] = newArticle;

        uint256 newId = getHistoryLength(index);
        articlesById[index].lenhistory++;
        articlesById[index].history[newId] = string(abi.encodePacked(date, ":\n ", content));

        return true;
    }

    //msg.sender
}
