pragma solidity ^0.5.0;

contract Wikipedia {
    struct Article {
        string title;
        string content;
    }

    uint256 public uniqueID = 1;
    uint256[] public ids;
    mapping(uint256 => Article) public articlesById;

    constructor() public {
        uint256 index = 0;
        ids.push(index);
        Article memory newArticle = Article(
            'Mon premier article',
            'Il est genial, vraiment !'
        );
        articlesById[index] = newArticle;
    }

    function articleContent(uint256 index) public view returns (string memory) {
        return articlesById[index].content;
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

    function addArticle(string memory title, string memory article)
        public
        returns (bool)
    {
        uint256 index = getID();
        ids.push(index);
        Article memory newArticle = Article(title, article);
        articlesById[index] = newArticle;
        return true;
    }

    function updateArticle(uint256 index,string memory content) public returns (bool) {
        string memory title = articlesById[index].title;
        Article memory newArticle = Article(title, content);
        articlesById[index] = newArticle;
        return true;
    }
    
    //msg.sender
}
